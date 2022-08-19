import { v4 as uuidv4 } from 'uuid';
import CategoryRepository from '../repositories/categories-repository';

export default class CategoryServices {

    public async createCategory(payload: ICategory, userId: string) {

        const categoryData: ICategory = {
            _id: uuidv4(),
            userId: userId,
            name: payload.name
        }

        if (!categoryData.userId) {
            return {
                status: 401,
                error: "Usuário não existente no sistema"
            }
        }

        if (!categoryData.name) {
            return {
                status: 400,
                error: "Falta o nome da categoria no Servidor"
            }
        }

        await new CategoryRepository().insert(categoryData)
    }


    public async updateCategory(payload: ICategory, userId: string): Promise<ICategory | IErrorOutput> {

        if (!payload.name) {
            return {
                status: 400,
                error: "Falta de novo Nome para a Categoria"
            }
        }
        const repository = new CategoryRepository()
        // @ts-ignore
        const categoryData: ICategory = await repository.getById(payload._id);

        if (!categoryData) {
            return {
                status: 404,
                error: "A Categoria não existe"
            }
        }

        categoryData.name = payload.name

        await repository.update(categoryData)
        return categoryData
    }

    public async deleteCategory(payload: ICategory, userId: string) {
        if (!payload._id) {
            return {
                status: 404,
                error: "Cartão não pode ser encontrado"
            }
        }

        const repository = new CategoryRepository()
        // @ts-ignore
        const categoryData: ICategory = await repository.getById(payload._id, userId)

        if (!categoryData) {
            return {
                status: 404,
                error: "Categoria Não Existe"
            }
        }


        await repository.delete(categoryData)
        
        return categoryData
    }

    public async getCategories(userId: string): Promise<ICategory[]> {
        return await new CategoryRepository().get(userId)
    }
}