import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpClientModule} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {User} from '../../shared/user.model';
import {UserService} from '../../shared/user.service'
import { send } from 'q';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [UserService]
})
export class SignUpComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessage: string;
  http: any;
  selectedUser: User;

  constructor(public userService: UserService, private httpClient: HttpClient) { }
  
  httpOptions = {headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  ngOnInit() {
    this.selectedUser = this.userService.selectedUser;
  }

  onSubmit(form: NgForm){
        var data = JSON.stringify(this.userService.selectedUser);
        console.log(data);
        this.httpClient.post("http://localhost:3000/signup", data, this.httpOptions).subscribe(d => {
        //this.httpClient.post("http://slu-acm.herokuapp.com/signup", data, this.httpOptions).subscribe(d => {
          console.log("Success", data);
        }, error => {
          console.log("Error", error);
        });
        
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.resetForm(form);
  }

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      first_name: '',
      last_name: '',
      email: '',
      major: '',
      w_num: '',
      password: ''
    };
    form.resetForm();
    this.serverErrorMessage = '';
  }
}