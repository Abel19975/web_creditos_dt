import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NgClass } from '@angular/common';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

import { ControlThemeComponent } from '../../shared/control-theme/control-theme.component';
import { AuthService } from '../auth-service';
import { AuthStore } from '../auth-store';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    FloatLabel,
    PasswordModule,
    Button,
    Message,
    ReactiveFormsModule,
    NgClass,
    ControlThemeComponent,
  ],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export default class InicioSesion {
  private router = inject(Router);

  private authSvc = inject(AuthService);
  private auth = inject(AuthStore);

  public isLoading = signal(false);
  public isError = signal('');

  protected form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  getControl(nombreCtrl: string) {
    return this.form.get(nombreCtrl) as FormControl;
  }

  protected async onSubmit() {
    this.isLoading.set(true);
    try {
      await this.authSvc.login({
        username: this.getControl('username').value,
        password: this.getControl('password').value,
      });
      this.router.navigate(['/']);
    } catch (error) {
      this.isError.set(`${error}`);
    } finally {
      this.isLoading.set(false);
    }
  }

  public imageLoaded = signal(false);
  private loadBackgroundImage() {
    const img = new Image();
    img.src = '/imagenes/imagen-inicio-sesion.png';
    img.onload = () => {
      this.imageLoaded.set(true);
    };
  }
  ngOnInit() {
    this.loadBackgroundImage();
    if (this.auth.isAuth()) {
      this.router.navigate(['/']);
    }
  }
}
