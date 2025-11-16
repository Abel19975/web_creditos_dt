export class Validations {
  #passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  #emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  #numericRegex = /^[0-9]+$/;

  public validateEmail(email: string): boolean {
    return this.#emailRegex.test(email);
  }
  public validatePassword(password: string): boolean {
    return this.#passwordRegex.test(password);
  }
  public validateNumericOnly(value: string): boolean {
    return this.#numericRegex.test(value);
  }
}
