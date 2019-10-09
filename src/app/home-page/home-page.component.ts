import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare var $: any ;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomePageComponent implements OnInit, AfterViewInit {
  
  TodoForm: FormGroup;
  public TodoList: any;
  public statusValue: any = ['created', 'working', 'finished', 'cancelled']
  public MainUrl: any = "https://engine-staging.viame.ae/assessment/user/";
  constructor(private fb: FormBuilder, private httpClient: HttpClient, public router: Router, public ref: ChangeDetectorRef, ) {
    this.createForm();
  }

  ngOnInit() {
    this.getTodoList();
  }
  ngAfterViewInit() {
    this.ref.detach();
  }

  tracktodoList(index, item) {
    return item._id;
  }

  getTodoList() {
    let url = this.MainUrl + "list";
    this.httpClient.get(url).subscribe(result => {
      this.TodoList = result;
      this.ref.detectChanges();
    });
  }

  createForm() {
    this.TodoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  Logout() {
    Swal.fire({
      title: 'Hey user!',
      text: "Sure want to logout..?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#071535',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.router.navigateByUrl('/login');
        localStorage.removeItem("userToken");
      }
    });
  }

  AddTodoService() {
    if (this.TodoForm.valid) {
      let data = {
        "todolist": {
          "title": this.TodoForm.value.title,
          "description": this.TodoForm.value.description,
          "status": "0"
        }
      };
      let url = this.MainUrl + "task";

      this.httpClient.post(url, data).subscribe(result => {
        this.getTodoList();
        this.ref.detectChanges();
        Swal.fire('Hey user!', 'New todo added successfully', 'success');
        this.createForm();
        $(function () {
          $('#myModal').modal('toggle');
       });
      });
    }
  }

  changeStatus(index, value) {
    let todoValue = this.TodoList[index];
    if (todoValue.status !== value) {
      let data = {
        "todolist": {
          "title": todoValue.title,
          "description": todoValue.description,
          "status": value
        }
      };
      let url = this.MainUrl + "task/" + todoValue._id;

      this.httpClient.put(url, data).subscribe(result => {
        this.getTodoList();
        this.ref.detectChanges();
        Swal.fire('Hey user!', 'Todo ststus changed successfully', 'success');
      });
    }
  }

  deleteTodo(index) {
    Swal.fire({
      title: 'Hey user!',
      text: "Sure want to delete todo..?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#071535',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        let todoValue = this.TodoList[index];
        let url = this.MainUrl + "task/" + todoValue._id;

        this.httpClient.delete(url).subscribe(result => {
          this.getTodoList();
          Swal.fire('Hey user!', 'Todo deleted successfully', 'success');
          this.ref.detectChanges();
        });
      }
    });
  }
}