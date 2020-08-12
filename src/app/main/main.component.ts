import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.isLoggedIn = this.checkIfLoggedIn();
        console.log(this.isLoggedIn);
      }
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.checkIfLoggedIn();
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = this.checkIfLoggedIn();
    this.cdr.detectChanges();
  }

  checkIfLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
