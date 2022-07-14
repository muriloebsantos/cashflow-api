import UserRepository from "../repositories/user-repository";
import { encode, TAlgorithm } from "jwt-simple";
import EntryService from "./entry-service";
import { v4 as uuidv4 } from 'uuid'
import { utcNow } from "../util/date-utils";

const key = process.env.JWT_KEY;

export default class UserService {

    public async authenticate(authPayload: IAuthPayload) : Promise<IAuthOutput | IErrorOutput> {
        if(!authPayload.email || !authPayload.password) {
            return { 
                status: 400,
                error: 'E-mail e senha devem ser informados'
            };
        }

        const userRepository = new UserRepository();
        const user = await userRepository.getByEmail(authPayload.email);

        if(!user) {
            return { 
                status: 401,
                error: 'E-mail ou senha inválido'
            }; 
        }

        if(user.password != this.hash512Password(authPayload.password)) {
            if(user.incorretLoginAttempts === null || user.incorretLoginAttempts === undefined){
                user.incorretLoginAttempts = 0;
            }

            user.incorretLoginAttempts++;

            if(user.incorretLoginAttempts >= 5) {
                user.isBlocked = true
            }

            await userRepository.updateUser(user);

            if(user.isBlocked) {
                return {
                    status: 401,
                    error: "A senha do usuário está bloqueada por tentativas de login excessivas"
                }
            }

            return { 
                status: 401,
                error: 'E-mail ou senha inválido'
            }; 
        }

        if(user.isBlocked) {
            return {
                status: 401,
                error: "A senha do usuário está bloqueada por tentativas de login excessivas"
            }
        }
        
        user.incorretLoginAttempts = 0;
        user.lastLoginDate = utcNow();
        await userRepository.updateUser(user);

        const algorithm: TAlgorithm = "HS512";
        const issued = Date.now();
        const ms = 6 * 60 * 60 * 1000;
        const expires = issued + ms;
        const session = {
            userId: user._id,
            email: user.email,
            issued: issued,
            expires: expires
        };

        return {
            expiration: new Date(expires),
            userId: user._id,
            token: encode(session, key, algorithm)
        };
    }

    public async getUser(id: string) : Promise<IUser> {
        const user = await new UserRepository().getById(id);

        user.savings = user.savings || 0;

        delete user.password;

        return user;
    }

    public async adjustBalance(userId: string, newBalance: number, newSavings: number, createEntry: boolean = false) {
        const userRepository = new UserRepository();
        const user = await userRepository.getById(userId);
        const currentBalance = user.balance;
        const currentSavings = user.savings || 0;
        const totalCurrentBalance = currentBalance + currentSavings;

        await userRepository.updateBalance(userId, newBalance, newSavings);

        const difference =  (newBalance + newSavings) - totalCurrentBalance;

        if(difference == 0) {
            return;
        }

        if(!createEntry) {
            return;
        }

        const type = difference > 0 ? 'C' : 'D';
        const entry: IInsertEntryPayload = {
            description: "Ajuste de saldo",
            dueDate: new Date(),
            type: type,
            value: Math.abs(difference),
            showRecurrenceNumber: false
        };

        await new EntryService().add(entry, userId, true);
    }

    private hash512Password (password:string) {
        const crypto = require('crypto');
        const hash512 = crypto.createHash('sha512');
        const preHashPassword =  hash512.update(password, 'utf-8');
        const hash512Password = preHashPassword.digest('hex');
        return hash512Password;
    } 

    private verifyPasswordStrength (password:string) {
        if(password.length >= 6) {
            return true;
        } else {
            return false;
        }
    } 
    
    public async createUser(user: IUser){
        
        try {
            const userRepository = new UserRepository();
            const existingEmail = await userRepository.getByEmail(user.email);

            if(existingEmail) {
                return {
                    status: 409,
                    error: 'Email já cadastrado no sistema'
                }                
            }

            if(!this.verifyPasswordStrength(user.password)) {
               return {
                status: 400,
                error: 'A Senha recebida não atende aos padrões de seguranca minímos'
               }
            }

            const utcTime = utcNow();
            user._id = uuidv4();
            const textPlainPassword = user.password
            user.password = this.hash512Password(textPlainPassword);
            user.balance = 0;
            user.isBlocked = false;
            user.incorretLoginAttempts = 0;
            user.creationDate = utcTime;
            user.lastLoginDate = utcTime;
            user.lastActivityDate = utcTime;

            await userRepository.insertUser(user);

            return await this.authenticate({
                email: user.email,
                password: textPlainPassword
            })
        }
        catch(e) {
            console.log(e);
        }
    }

    public async updateLastActiveTime(_id: string) {
        const userRepository = new UserRepository();
        const user = await userRepository.getById(_id);
        if(user) {
            user.lastActivityDate = utcNow();
            await userRepository.updateUser(user);
        } else {
            return {
                status: 404,
                error: 'Usuário inexistente no sistema'
            }       
        }
    }
}