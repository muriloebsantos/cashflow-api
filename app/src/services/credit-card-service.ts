import { v4 as uuidv4 } from 'uuid';
import CreditCardRepository from '../repositories/credit-card-repository';

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
}