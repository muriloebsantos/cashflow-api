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

    public async updateBalance(userId: string, balance: number, savings: number) {
        const db = await connect();
        
        return db.collection('users').updateOne({ _id: userId }, { $set: { balance, savings } });
    }

    public async insertUser(user:IUser){
        const db = await connect();

        return db.collection('users').insert(user);
    }
}