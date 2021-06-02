import { connect } from './connection';

export default class EntryRepository {

    public async insertMany(entries: IEntry[]) {
        const db = await connect();
        
        return db.collection('entries').insertMany(entries);
    } 

    public async getById(userId: string, id: string) : Promise<IEntry> {
        const db = await connect();
        
        return db.collection('entries').findOne({ _id: id, userId: userId });
    }

    public async setAsPaid(id: string) {
        const db = await connect();
        
        return db.collection('entries').updateOne({ _id: id }, { $set: { isPaid: true }});
    }

    public async getPendingEntries(userId: string, initialDate: Date, endDate: Date) : Promise<IEntry[]> {
        const db = await connect();

        return db.collection('entries').find(
            { userId: userId, 
              isPaid: false,
              dueDate: {
                $gte: initialDate,
                $lt: endDate
            }
        }).toArray();
    }
}