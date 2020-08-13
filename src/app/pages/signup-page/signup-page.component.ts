import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    document.body.classList.add('background');
  }

  ngOnDestroy() {
    document.body.className = '';
  }

  onSignupButtonClicked(email: string, password: string, username: string) {
    this.authService
      .signup(email, password, username)
      .subscribe((res: HttpResponse<any>) => {
        console.log(res);
        this.router.navigate(['/']);
      });
  }
}
