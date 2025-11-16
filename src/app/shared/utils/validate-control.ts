import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Validations } from './regex';

export class ControlValidators {
  static matchPassword(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  static emailPattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return new Validations().validateEmail(value)
        ? null
        : { emailPattern: 'El correo electrónico es inválido' };
    };
  }

  static passwordPattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return new Validations().validatePassword(value)
        ? null
        : {
            passwordPattern:
              'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
          };
    };
  }

  static numericOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return new Validations().validateNumericOnly(value)
        ? null
        : { numericOnly: 'El valor ingresado no es numérico' };
    };
  }
}
