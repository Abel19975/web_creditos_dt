import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/components/sidebar/sidebar';
import { Header } from '../shared/components/header/header';

@Component({
  selector: 'dashboard-layout',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {}
