import { Component, OnInit } from '@angular/core';
import {TodosService} from "../_services/todos.service";
import {ActivatedRoute} from "@angular/router";
import {Todo, TodoResult} from "../models/todo";
import { faTrash, faPencilAlt, faInfoCircle, faCalendar, faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly notifier: NotifierService;
  pencilIcon = faPencilAlt;
  trashIcon = faTrash;
  infoCircleIcon = faInfoCircle;
  calendarIcon = faCalendar;
  calendarTimesIcon = faCalendarTimes;
  todoForm!: FormGroup;
  loading = false;
  submitted = false;
  todos!: Todo[];
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private todosService: TodosService, notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  async ngOnInit(): Promise<void> {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', '']
    });
    this.todos = await this.todosService.getTodos();
  }
  get f() { return this.todoForm.controls; }
  addTodo() {
    this.submitted = true;
    this.loading = true;
    if (this.todoForm.invalid) {
      this.loading = false;
      return;
    }
    this.todosService.createTodo(this.f.title.value, this.f.description.value)
      .subscribe(({ data }) => {
        this.loading = false;
        this.submitted = false;
        this.todos = Object.assign([], this.todos);
        this.todos.push(<Todo>data?.createTodo)
        this.notifier.notify('success', 'Add Successful');
        this.todoForm.reset()
      }, (error) => {
        this.loading = false;
        this.notifier.notify('error', error);
      });
  }
  editTodo(id: string) {
    console.log('Edit Todo : ', id)
  }
  deleteTodo(id: string) {
    console.log('Delete Todo : ', id)
  }

}
