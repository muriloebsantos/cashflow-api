import { Db, MongoClient } from 'mongodb';

 let db: Db;

 const connect = async () : Promise<Db> => {
    if(db) {
        return db;
    }

    const uri = process.env.DB_CONNECTION;
    const client =  new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    await client.connect();

    db = client.db("cashflow");

    return db;
};

export { connect };