import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // Roditelj (AppComponent) hvata ovaj event da otvori/zatvori bočni meni.
  @Output() toggleSidenav = new EventEmitter<void>();
}
