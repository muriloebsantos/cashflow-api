const isLeapYear = (year: number) => { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
}

const daysInMonth = (year: number, month: number) => {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

const addMonths = (date: Date, value: number) => {
    const d = new Date(date);
    const n = date.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + value);
    d.setDate(Math.min(n, daysInMonth(d.getFullYear(), d.getMonth())));
    return d;
}

const utcNow = () => {
    const date = new Date();
    const utcTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return new Date(utcTime);
}

export  { addMonths, daysInMonth, utcNow };