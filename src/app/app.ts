import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Loader } from './shared/components/loader/loader';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialog, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly loaderSvc = inject(LoaderService);
}
