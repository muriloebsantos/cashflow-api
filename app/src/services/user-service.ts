import UserRepository from "../repositories/user-repository";
import { encode, TAlgorithm } from "jwt-simple";

const key = "b7TxMbAWrGskAEHkjTuFFhs7KCQB5XvXCVX58q6vN8HQBMDZEfTs6KXG8snRKfUdDsC3QMqmdevFqZQMpW6TyGxpwxh7NYKfnSfLvBL54ZTgsRpeTjT2Kx5JYB3KCRaT";

export default class UserService {

    public async authenticate(authPayload: IAuthPayload) : Promise<IAuthOutput | IErrorOutput> {
        if(!authPayload.email || !authPayload.password) {
            return { 
                status: 400,
                error: 'E-mail e senha devem ser informados'
            };
        }

        const user = await new UserRepository().getByEmail(authPayload.email);

        if(!user || user.password != authPayload.password) {
            return { 
                status: 401,
                error: 'E-mail ou senha inválido'
            }; 
        }

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

        delete user.password;

        return user;
    }
}