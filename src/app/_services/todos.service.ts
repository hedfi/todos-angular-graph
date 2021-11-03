import {Injectable} from "@angular/core";
import { Apollo, gql, QueryRef, Mutation } from 'apollo-angular';
import {CreateTodo, DeleteTodo, EditTodo, Todo, TodoResult} from "../models/todo";
import {Observable} from "rxjs";
import {FetchResult} from "apollo-link";

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
  private TodosQuery: QueryRef<{todos: Todo[]}>;

  constructor(private apollo: Apollo) {
    this.TodosQuery = this.apollo.watchQuery({
      query: gql`query todos {
        todos {
          id
          title
          description
          completed
          createdAt
          updatedAt
        }
      }`
    });
  }
  async getTodos(): Promise<Todo[]> {
    const result = await this.TodosQuery.refetch();
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
