interface IInsertEntryPayload {
    type: string;
    description: string;
    value: number;
    dueDate: Date;
    creditCardId?: string;
    purchaseDate?: Date;
    recurrenceType?: string;
    recurrenceNumber?: number;
    showRecurrenceNumber: boolean;
    isPaid: boolean;
    commitEntries: boolean;
}