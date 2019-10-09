import { Component, OnInit, ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from "@angular/common/http";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'FadeOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('1s ease-out',
              style({ opacity: 1 }))
          ]
        )
      ]
    )
  ]
})


export class LoginPageComponent implements OnInit {

  LoginForm: FormGroup;
  RegistorForm: FormGroup;
  public MainUrl: any = "https://engine-staging.viame.ae/assessment/";
  public isRegister: boolean = true;

  constructor(private fb: FormBuilder, private httpClient: HttpClient, public router: Router,public ref: ChangeDetectorRef, ) {
    this.createForm();
  }

  createForm() {
    this.LoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.RegistorForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    }, {
      validator: this.checkPasswords
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('repassword').value;

    return pass === confirmPass ? null : {
      notSame: true
    }
  }

  loginService() {
    let url = this.MainUrl + "login";

    if (this.LoginForm.valid) {
      let data = {
        "users": {
          "email": this.LoginForm.value.username,
          "password": this.LoginForm.value.password
        }
      };

      this.httpClient.post(url, data).subscribe(result => {
        if ((<any>result).token) {
          localStorage.setItem('userToken', JSON.stringify(result));
          this.router.navigateByUrl('/home');
        } else {
          Swal.fire('Hey user!', 'Check your username and password..!', 'warning');
        }
      });
    }
  }

  registerService() {
    let url = this.MainUrl + "users";

    if (this.RegistorForm.valid) {

      let data = {
        "users": {
          "email": this.RegistorForm.value.username,
          "password": this.RegistorForm.value.password
        }
      };

      this.httpClient.post(url, data).subscribe(result => {
        if ((<any>result)._id) {
          Swal.fire({
            title: 'Hey user!',
            text: "Register successfull..!",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#071535',
            confirmButtonText: 'Login'
          }).then((result) => {
            if (result.value) {
              this.isRegister = true;
              this.ref.detectChanges();
            }
          });
        } else {
          Swal.fire('Hey user!', 'Some error happened..!', 'warning');
        }
      });
    }
  }
  ngOnInit() {

  }

}