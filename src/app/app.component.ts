import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from './services/users.service';
import { Role, SafeUser } from '../types';
import { SpinerComponent } from './modules/shared/spinner/spinner.component';
import { ToastsContainer } from './modules/shared/toasts/toasts-container.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgbModule, SpinerComponent, ToastsContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'EsTim';
  currentUser?: SafeUser | null
  Role = Role
  isAuthRoute = false

  constructor(
    private router: Router,
    private usersService: UsersService,
  ) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.isAuthRoute = ev.url.includes("auth");
        this.currentUser = this.usersService.getCurrentUser()
      }
    });
  }
  ngOnInit(): void {
    this.currentUser = this.usersService.getCurrentUser()
  }

  logout() {
    this.usersService.logOut()
    this.currentUser = null;
    this.router.navigate(['/auth/login'])
  }
}
