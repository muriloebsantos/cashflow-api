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
}