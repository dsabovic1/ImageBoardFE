import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  email = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService,
    private router: Router,
    private _fb: FormBuilder
  ) {
    this.form = _fb.group({
      email: this.email,
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.form = this._fb.group({
      username: '',
      password: '',
    });
  }

  onLoginButtonClicked(email: string, password: string) {
    console.log(email, password);
    this.authService
      .login(email, password)
      .subscribe((res: HttpResponse<any>) => {
        if (res.status === 200) {
          // we have logged in successfully
          this.router.navigate(['/']);
        }
        console.log(res);
      });
  }
}
