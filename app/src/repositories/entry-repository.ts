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

    public async deletePendingByRecurrenceId(userId: string, recurrenceId: string) {
        const db = await connect();
        
        return db.collection('entries').deleteMany({ recurrenceId: recurrenceId, userId: userId });
    }

    public async delete(userId: string, id: string) {
        const db = await connect();
        
        return db.collection('entries').deleteOne({ _id: id, userId: userId });
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
                $lte: endDate
            }
        }).sort({ dueDate: 1 }).toArray();
    }

    public async update(entry: IEntry) {
        const db = await connect();
        
        return db.collection('entries').replaceOne({ _id: entry._id }, entry);
    }

    public async updateMany(userId: string, recurrenceId: string, type: string, description: string, value: number) {
        const db = await connect();
        
        return db.collection('entries')
                .updateMany({ recurrenceId: recurrenceId, userId: userId, isPaid: false }, 
                            {
                               $set: { 
                                type: type,
                                description: description,
                                value: value
                            } 
                        });
    }
}