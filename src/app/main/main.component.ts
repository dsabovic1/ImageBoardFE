import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  isLoggedIn: boolean;
  hasError: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBarModule
  ) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.isLoggedIn = this.checkIfLoggedIn();
        console.log(this.isLoggedIn);
      }
    });
    this.hasError = true;
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

  openSnackBar() {
    this._snackBar.open('Something went wrong :(');
  }
}
