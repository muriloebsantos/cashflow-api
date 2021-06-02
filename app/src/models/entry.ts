interface IEntry {
    _id: string;
    userId: string;
    type: string;
    description: string;
    value: number;
    dueDate: Date;
    isPaid: boolean;
    creditCardId?: string;
    recurrenceId?: string;
    recurrenceNumber?: number;
    recurrenceTotal?: number;
    showRecurrenceNumber: boolean;
}