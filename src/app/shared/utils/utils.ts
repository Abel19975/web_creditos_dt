export class Utils {
  // static getDate(): string {
  //   const localDate = new Date();
  //   const year = localDate.getFullYear();
  //   const month = String(localDate.getMonth() + 1).padStart(2, '0');
  //   const day = String(localDate.getDate()).padStart(2, '0');
  //   const hours = String(localDate.getHours()).padStart(2, '0');
  //   const minutes = String(localDate.getMinutes()).padStart(2, '0');
  //   const seconds = String(localDate.getSeconds()).padStart(2, '0');
  //   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  // }

  static getDate(value: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - value);
    return date;
  }

  // static now(): Date {
  //   const localDate = new Date();
  //   const offset = localDate.getTimezoneOffset() * 60000;
  //   return new Date(localDate.getTime() - offset);
  // }

  // static currentDate(): string {
  //   const date = new Date();
  //   const offset = date.getTimezoneOffset() * 60000;
  //   const localDate = new Date(date.getTime() - offset);
  //   return localDate.toISOString();
  // }

  // static sixMonthsLater(): string {
  //   const date = new Date();
  //   date.setMonth(date.getMonth() + 6);
  //   return date.toISOString();
  // }

  // static oneYearLater(): string {
  //   const date = new Date();
  //   date.setFullYear(date.getFullYear() + 1);
  //   return date.toISOString();
  // }

  // static formatDateToValidISO(date: Date | string): string {
  //   const d = typeof date === 'string' ? new Date(date) : date;
  //   const year = d.getFullYear();
  //   const month = `${d.getMonth() + 1}`.padStart(2, '0');
  //   const day = `${d.getDate()}`.padStart(2, '0');
  //   const hours = `${d.getHours()}`.padStart(2, '0');
  //   const minutes = `${d.getMinutes()}`.padStart(2, '0');
  //   const seconds = `${d.getSeconds()}`.padStart(2, '0');
  //   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  // }

  // static getDateDifferenceInDays(startDate: string | Date): number | null {
  //   const now = new Date();
  //   const birth = new Date(startDate);
  //   const diffMs = now.getTime() - birth.getTime();
  //   const ageInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  //   return ageInDays;
  // }
}
