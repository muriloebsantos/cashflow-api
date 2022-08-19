import { Db } from 'mongodb';
import { connect } from './connection';

export default class CategoryRepository {

    public async insert (categoryData:ICategory) {
        const db = await connect()

        return db.collection("categories").insert(categoryData)
    }

    public async update (categoryData:ICategory) {
        const db = await connect()

        return db.collection("categories").replaceOne({_id: categoryData._id}, categoryData)
    }

    public async delete (categoryData:ICategory) {
        const db = await connect()

        return db.collection("categories").deleteOne({_id: categoryData._id, userId: categoryData.userId})
    }

    public async get(userId: string) : Promise<ICreditCard[]> {
        const db = await connect();
        
        return db.collection('categories').find({_id: userId}).toArray();
    }

    public async getById(id: string, userId: string) : Promise<ICreditCard> {
        const db = await connect();
        
        return db.collection('categories').findOne({_id: id, userId});
    }
    
}