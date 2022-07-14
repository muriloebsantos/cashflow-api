interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    balance: number;
    savings: number;
    isBlocked: boolean;
    incorretLoginAttempts: number;
    creationDate: Date;
    lastLoginDate: Date;
}