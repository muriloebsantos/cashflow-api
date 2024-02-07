import { connect } from './connection';

export default class UserRepository {

    public async getByEmail(email: string) : Promise<IUser> {
        const db = await connect();
        
        return db.collection('users').findOne({ email: email });
    }
    
    public async getById(id: string) : Promise<IUser> {
        const db = await connect();
        
        return db.collection('users').findOne({ _id: id });
    }
    
    public async getUsers(): Promise<IUser[]> {
        const db = await connect()

        return db.collection('users').find().toArray();
    }

    public async updateBalance(userId: string, balance: number, savings: number) {
        const db = await connect();
        
        return db.collection('users').updateOne({ _id: userId }, { $set: { balance, savings } });
    }

    public async insertUser(user:IUser){
        const db = await connect();

        return db.collection('users').insert(user);
    }

    public async updateUser(user:IUser) {
        const db = await connect();

        return db.collection('users').replaceOne({_id: user._id}, user);
    } 

}