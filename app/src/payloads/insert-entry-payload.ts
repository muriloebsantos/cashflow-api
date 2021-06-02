interface IInsertEntryPayload {
    type: string;
    description: string;
    value: number;
    dueDate: Date;
    creditCardId?: string;
    recurrenceNumber?: number;
    showRecurrenceNumber: boolean;
}