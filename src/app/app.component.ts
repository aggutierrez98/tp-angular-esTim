import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from './users.service';
import { SafeUser } from '../types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'EsTim';
  currentUser?: SafeUser | null

  constructor(
    private router: Router,
    private usersService: UsersService,
  ) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
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
