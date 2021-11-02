import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';

const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
})

const httpLink = new HttpLink({
  uri: uri
});

const httpLinkWithErrorHandling = ApolloLink.from([
  errorLink,
  httpLink,
]);


export function createApollo() {
  return {
    link: httpLinkWithErrorHandling,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo
    },
  ],
})
export class GraphQLModule {}
