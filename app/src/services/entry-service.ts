import { v4 as uuidv4 } from 'uuid';
import EntryRepository from '../repositories/entry-repository';
import UserRepository from '../repositories/user-repository';
import { addMonths, daysInMonth } from '../util/date-utils';

export default class EntryService {

    public async add(payload: IInsertEntryPayload, userId: string, isPaid: boolean = false) {
        const entries: IEntry[] = [];
        const recurrenceNumber = payload.recurrenceNumber || 1;
        const recurrenceId = recurrenceNumber == 1 ? null : uuidv4();
        let dueDate = new Date(payload.dueDate);

        for(let i = 1; i <= recurrenceNumber; i ++ ) {
            entries.push({
                _id: uuidv4(),
                userId: userId,
                type: payload.type,
                description: payload.description,
                value: payload.value,
                dueDate: dueDate,
                isPaid: isPaid,
                showRecurrenceNumber: payload.showRecurrenceNumber,
                creditCardId: payload.creditCardId,
                recurrenceId: recurrenceId,
                recurrenceNumber: i,
                recurrenceTotal: recurrenceNumber
            });

            dueDate = addMonths(dueDate, 1);
        }

        return new EntryRepository().insertMany(entries);
    }

    public async getPendingEntries(userId: string, initialMonth?: number, initialYear?: number) {
        if(!initialMonth || !initialYear) {
            const currentDate = new Date();
            initialMonth = currentDate.getMonth() + 1;
            initialYear = currentDate.getFullYear();
        }

        const initialDate = new Date(initialYear, initialMonth - 1, 1);
        const endDate = addMonths(initialDate, 3);
        endDate.setDate(daysInMonth(endDate.getFullYear(), endDate.getMonth()));

        return new EntryRepository().getPendingEntries(userId, initialDate, endDate);
    }

    public async commitSingleEntry(userId: string, entryId: string): Promise<IErrorOutput> {
        const entryRepository = new EntryRepository();
        const entry = await entryRepository.getById(userId, entryId);

        if(!entry) {
            return {
                status: 404,
                error: 'Lançamento não encontrado'
            }
        }

        if(entry.isPaid) {
            return {
                status: 422,
                error: 'Lançamento já efetivado'
            }
        }

        const userRepository = new UserRepository();
        const user = await userRepository.getById(userId);
        
        let currentBalance = user.balance;

        if(entry.type === 'C') {
            currentBalance = currentBalance + entry.value;
        } else {
            currentBalance = currentBalance - entry.value;
        }

        await entryRepository.setAsPaid(entryId);
        await userRepository.updateBalance(userId, currentBalance);
    }
}