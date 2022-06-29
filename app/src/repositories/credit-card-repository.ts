import { Db } from 'mongodb';
import { connect } from './connection';

export default class CreditCardRepository {

    public async insert(creditCard: ICreditCard) {
        const db = await connect();
        
        return db.collection('credit_cards').insert(creditCard);
    }

    public async get(userId: string) : Promise<ICreditCard[]> {
        const db = await connect();
        
        return db.collection('credit_cards').find({ userId: userId }).toArray();
    }

    public async delete(creditCardId:string, userId:string) {
        const db = await connect()

        return db.collection('credit_cards').deleteOne({
            userId: userId,
            _id: creditCardId
        });
    }

    public async getById(creditCardID:string, userId:string) {
        const db = await connect()
            
        return db.collection('credit_cards').findOne({ _id: creditCardID, userId: userId });
    }
}