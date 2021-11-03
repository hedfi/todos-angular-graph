import {Injectable} from "@angular/core";
import { Apollo, gql, QueryRef, Mutation } from 'apollo-angular';
import {CreateTodo, DeleteTodo, EditTodo, Todo, TodoResult} from "../models/todo";
import {Observable} from "rxjs";
import {FetchResult} from "apollo-link";

const TODOS = gql`
  query {
    todos {
      count
      todos {
        id
        title
        description
        completed
        createdAt
        updatedAt
      }
    }
  }`
const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String) {
    createTodo(title: $title, description: $description) {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;
const DELETE_TODO = gql`
  mutation deleteTodo($todoId: ID!) {
    deleteTodo(todoId: $todoId) {
      id
      title
      completed
      description
      createdAt
      updatedAt
    }
  }
`;
const EDIT_TODO = gql`
  mutation editTodo($todoId: ID!, $title: String, $description: String, $completed: Boolean) {
    editTodo(todoId: $todoId, title: $title, description: $description, completed: $completed) {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private TodosQuery: QueryRef<{todos: TodoResult}, { skip: number, limit: number, orderField: string, orderBy: string, completed: string}>;

  constructor(private apollo: Apollo) {
    this.TodosQuery = this.apollo.watchQuery({
      query: TODOS
    });
  }
  async getTodos(skip = 0,limit = 10, orderField = 'createdAt', orderBy = 'asc', completed = ''): Promise<TodoResult> {
    const result = await this.TodosQuery.refetch({ skip, limit, orderField, orderBy, completed });
    return result.data.todos;
  }
  createTodo(title: string, description?: string): Observable<FetchResult<CreateTodo>> {
    return this.apollo.mutate({
      mutation: CREATE_TODO,
      variables: {
        title,
        description
      }
    })
  }
  deleteTodo(todoId: string): Observable<FetchResult<DeleteTodo>> {
    return this.apollo.mutate({
      mutation: DELETE_TODO,
      variables: {
        todoId
      }
    })
  }
  editTodo(todoId: string, title?: string, description?: string, completed?: boolean): Observable<FetchResult<EditTodo>> {
    return this.apollo.mutate({
      mutation: EDIT_TODO,
      variables: {
        todoId,
        title,
        description,
        completed
      }
    })
  }
}
