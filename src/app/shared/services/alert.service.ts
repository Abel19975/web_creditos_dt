import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

export interface OpcionesConfirmacion {
  message: string;
  title?: string;
  icon?: string;
  textAccept?: string;
  textReject?: string;
  acceptSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  confirm(options: OpcionesConfirmacion): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.confirmationService.confirm({
        header: options.title || 'Confirmación',
        message: options.message,
        icon: options.icon || 'pi pi-exclamation-triangle',
        acceptLabel: options.textAccept || 'Aceptar',
        rejectLabel: options.textReject || 'Cancelar',
        rejectButtonStyleClass: 'p-button-secondary p-button-text',
        acceptButtonStyleClass: `p-button-${options.acceptSeverity || 'primary'}`,
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

  confirmDelete(title?: string, message?: string): Promise<boolean> {
    return this.confirm({
      message: message || '¿Está seguro de que desea eliminar este registro?',
      title: title || 'Confirmar Eliminación',
      icon: 'pi pi-trash',
      acceptSeverity: 'danger',
      textAccept: 'Sí, eliminar',
      textReject: 'No, cancelar',
    });
  }

  exito(title: string, message: string) {
    this.messageService.add({ severity: 'success', summary: title, detail: message });
  }

  error(title: string, message: string) {
    this.messageService.add({ severity: 'error', summary: title, detail: message });
  }

  info(title: string, message: string) {
    this.messageService.add({ severity: 'info', summary: title, detail: message });
  }
}
