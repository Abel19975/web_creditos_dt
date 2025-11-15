import { Component, output } from '@angular/core';

@Component({
  selector: 'app-toggle-sidebar',
  imports: [],
  templateUrl: './toggle-sidebar.html',
  styleUrl: './toggle-sidebar.css',
})
export class ToggleSidebar {
  toggle = output<void>();
}
