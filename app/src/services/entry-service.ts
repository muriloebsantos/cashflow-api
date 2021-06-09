import { v4 as uuidv4 } from 'uuid';
import EntryRepository from '../repositories/entry-repository';
import UserRepository from '../repositories/user-repository';
import { addMonths, daysInMonth } from '../util/date-utils';
import * as moment from 'moment';

export default class EntryService {

    public async add(payload: IInsertEntryPayload, userId: string, isPaid: boolean = false) {
        const entries: IEntry[] = [];
        const recurrenceNumber = payload.recurrenceNumber || 1;
        const recurrenceId = recurrenceNumber == 1 ? null : uuidv4();
        const recurrenceType = payload.recurrenceType || 'M';
        let dueDate = new Date(payload.dueDate);

        for(let i = 1; i <= recurrenceNumber; i ++ ) {
            entries.push({
                _id: uuidv4(),
                userId: userId,
                type: payload.type,
                description: payload.description,
                value: payload.value || 0,
                dueDate: dueDate,
                purchaseDate: payload.purchaseDate,
                isPaid: isPaid,
                showRecurrenceNumber: payload.showRecurrenceNumber,
                creditCardId: payload.creditCardId,
                recurrenceId: recurrenceId,
                recurrenceNumber: i,
                recurrenceTotal: recurrenceNumber
            });

            switch (recurrenceType) {
                case 'W':
                    dueDate = moment(dueDate).add(1, 'weeks').toDate();
                    break;
                 case 'F':
                    dueDate = moment(dueDate).add(15, 'days').toDate();
                    break;
                case 'M':
                    dueDate = moment(dueDate).add(1, 'months').toDate();
                    break;
                case 'Y':
                    dueDate = moment(dueDate).add(1, 'years').toDate();
                    break;
            }
        }

        return new EntryRepository().insertMany(entries);
    }

    public async getPendingEntries(userId: string, initialMonth?: number, initialYear?: number, includeOverdue?: number) {

        let initialDate = new Date(initialYear, initialMonth - 1, 1);
        const endDate = addMonths(initialDate, 2);
        endDate.setDate(daysInMonth(endDate.getFullYear(), endDate.getMonth()));
        endDate.setHours(23, 59, 59);

        if(includeOverdue === 1) {
            initialDate = new Date(2000, 1, 1);
        }

        return new EntryRepository().getPendingEntries(userId, initialDate, endDate);
    }

    public async commitMany(userId: string, entriesId: string[]): Promise<IErrorOutput> {
        const entryRepository = new EntryRepository();
        const entries: IEntry[] = [];

        for(let entryId of entriesId) {
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

            entries.push(entry);
        }

        const userRepository = new UserRepository();
        const user = await userRepository.getById(userId);
        
        let currentBalance = user.balance;

        for(let entry of entries) {
            if(entry.type === 'C') {
                currentBalance = currentBalance + entry.value;
            } else {
                currentBalance = currentBalance - entry.value;
            }
    
            await entryRepository.setAsPaid(entry._id);
        }
      
        await userRepository.updateBalance(userId, currentBalance);
    }

    public async delete(userId: string, entryId: string, deleteAll: number): Promise<IErrorOutput> {
        const entryRepository = new EntryRepository();
        const entry = await entryRepository.getById(userId, entryId);

        if(!entry) {
            return {
                status: 404,
                error: 'Lançamento não encontrado'
            }
        }

        if(deleteAll !== 1) {
            await entryRepository.delete(userId, entryId);
        } else if(deleteAll && entry.recurrenceId) {
            await entryRepository.deletePendingByRecurrenceId(userId, entry.recurrenceId);
        }
    }

    public async update(userId: string, entryId: string, payload: IUpdateEntryPayload, updateAll: number): Promise<IErrorOutput> {
        const entryRepository = new EntryRepository();
        const entry = await entryRepository.getById(userId, entryId);

        if(!entry) {
            return {
                status: 404,
                error: 'Lançamento não encontrado'
            }
        }

        if(updateAll !== 1) {
            entry.type = payload.type;
            entry.description = payload.description;
            entry.value = payload.value || 0;

            if(!entry.creditCardId) {
                entry.dueDate = new Date(payload.dueDate);
            }  else {
                entry.purchaseDate = new Date(payload.dueDate);
            }

            await entryRepository.update(entry);
        } else {
            await entryRepository.updateMany(userId, entry.recurrenceId, payload.type, payload.description, payload.value || 0);
        }
    }
}