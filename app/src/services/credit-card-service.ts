import { v4 as uuidv4 } from 'uuid';
import CreditCardRepository from '../repositories/credit-card-repository';
import EntryRepository from '../repositories/entry-repository';

export default class CreditCardService {

    public async create(payload: any, userId: string): Promise<ICreditCard | IErrorOutput> {
        
        const creditCard: ICreditCard = {
            _id: uuidv4(),
            userId: userId,
            name: payload.name,
            dueDay: payload.dueDay,
            closingDay: payload.closingDay
        };

        if(!creditCard.name) {
            return { status: 400, error: 'Nome é obrigatório' };
        }

        if(!creditCard.dueDay) {
            return { status: 400, error: 'Dia de vencimento da fatura é obrigatório' };
        }

        if(!creditCard.closingDay) {
            return { status: 400, error: 'Dia de fechamento da fatura é obrigatório' };
        }

        creditCard._id = uuidv4();
        creditCard.userId = userId;

        await new CreditCardRepository().insert(creditCard);

        return creditCard;
    }

    public async get(userId: string): Promise<ICreditCard[]> {
        return new CreditCardRepository().get(userId);
    }

    public async delete(userId: string, creditCardId: string): Promise<IErrorOutput> {
        const creditCardRepository = new CreditCardRepository();
        const entryRepository = new EntryRepository();

        try {
            if(!await creditCardRepository.getById(creditCardId, userId)){
                return {
                    status: 404,
                    error: 'Cartão não encontrado'
                }
            }

           await Promise.all([
               creditCardRepository.delete(creditCardId, userId),
               entryRepository.deleteByCreditCard(creditCardId, userId)
            ])
        }
        catch(e){
            console.log(e);
            return {
                status: 500,
                error: 'Erro ao Excluir Cartão'
            }
        }
    }

    public async Update(userId:string, creditCard:ICreditCard):Promise<IErrorOutput>{
        const creditCardRepository = new CreditCardRepository();

        try {
            const existingCard = await creditCardRepository.getById(creditCard._id, userId)
            if(!existingCard){
                return {
                    status: 404,
                    error: 'Cartão não encontrado'
                }
            }
            existingCard.name = creditCard.name;
            existingCard.dueDay = creditCard.dueDay;
            existingCard.closingDay = creditCard.closingDay;

           await creditCardRepository.update(existingCard);
        }
        catch(e){
            console.log(e)
            return {
                status: 500,
                error: 'Erro ao Atualizar Cartão'
            }
        }
    }
}