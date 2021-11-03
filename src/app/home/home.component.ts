import { Component, OnInit } from '@angular/core';
import {TodosService} from "../_services/todos.service";
import {ActivatedRoute} from "@angular/router";
import {EditTodo, Todo, TodoResult} from "../models/todo";
import { faTrash, faPencilAlt, faInfoCircle, faCalendar, faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifierService} from "angular-notifier";
import * as _ from "lodash"
import {$e} from "@angular/compiler/src/chars";

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
  edit = false;
  selectedTodoId: string = ''
  btnSubmit: string = 'Add'
  submitted = false;
  todos: Todo[] = [];
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private todosService: TodosService, notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  async ngOnInit(): Promise<void> {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', '']
    });
    this.todos = await this.todosService.getTodos();
    this.todos = Object.assign([], this.todos);
  }
  get f() { return this.todoForm.controls; }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.todoForm.invalid) {
      this.loading = false;
      return;
    }
    if(!this.edit) {
      this.todosService.createTodo(this.f.title.value, this.f.description.value)
        .subscribe(({ data }) => {
          this.loading = false;
          this.submitted = false;
          this.todos.push(<Todo>data?.createTodo)
          this.notifier.notify('success', 'Added Successful');
          this.todoForm.reset()
        }, (error) => {
          this.loading = false;
          this.notifier.notify('error', error);
        });
    } else {
      const id = this.selectedTodoId
      this.todosService.editTodo(this.selectedTodoId, this.f.title.value, this.f.description.value)
        .subscribe(({ data }) => {
          this.loading = false;
          this.submitted = false;
          const todoIndex =_.findIndex(this.todos, function(todo) { return todo.id == id });
          this.todos.splice(todoIndex, 1, <Todo>{ ...data?.editTodo });
          this.notifier.notify('success', 'Edited Successful');
          this.cancelEdit()
        }, (error) => {
          this.loading = false;
          this.notifier.notify('error', error);
        });
    }
  }
  editTodo(id: string) {
    const todo = _.find(this.todos, function(todo) { return todo.id == id; });
    this.edit = true
    this.selectedTodoId = id
    this.btnSubmit = 'Edit'
    this.f.title.setValue(todo?.title)
    this.f.description.setValue(todo?.description)
  }
  deleteTodo(id: string) {
    this.todosService.deleteTodo(id)
      .subscribe(({ data }) => {
        this.loading = false;
        this.submitted = false;
        _.remove(this.todos, function(todo) {
          return todo.id == id;
        });
        this.notifier.notify('success', 'Deleted Successful');
      }, (error) => {
        this.loading = false;
        this.notifier.notify('error', error);
      });
  }
  cancelEdit() {
    this.edit = false
    this.todoForm.reset()
    this.selectedTodoId = ""
    this.btnSubmit = 'Add'
  }
  todoCompleted(id: string, $event: any) {
    this.loading = true;
    this.todosService.editTodo(id, '', '', $event.target.checked)
      .subscribe(({ data }) => {
        this.loading = false;
        this.notifier.notify('success', 'Edited Successful');
      }, (error) => {
        this.loading = false;
        this.notifier.notify('error', error);
      });
  }
}
