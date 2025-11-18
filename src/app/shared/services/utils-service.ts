import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  soloNumeros(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, '');
  }

  soloNumerosDecimales(event: any) {
    const inputValue = event.target.value;
    const cleanedValue = inputValue.replace(/[^0-9.,]/g, '').replace(/[,\.](?=.*[,\.])/g, '');
    event.target.value = cleanedValue;
  }
}
