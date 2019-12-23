[![GitHub release](https://img.shields.io/github/tag/manifoldco/gql-zero.svg?label=latest)](https://github.com/manifoldco/gql-zero/releases)
[![Travis](https://img.shields.io/travis/manifoldco/gql-zero/master.svg)](https://travis-ci.org/manifoldco/gql-zero)
[![License](https://img.shields.io/badge/license-BSD-blue.svg)](./LICENSE.md)

# ⚡️ gql-zero

A `0.3 KB` alternative for consuming GraphQL. Zero caching, zero bells. Zero Bloat.

## Usage

```bash
npm i @manifoldco/gql-zero
```

### 🧁 Using Vanilla JS fetch (TS types added for convenience)

```ts
import gql from '@manifoldco/gql-zero';

const query = async <T>(query: string, options: RequestInit = {}): T | undefined => {
  try {
    const res = await fetch('https://pokeapi-graphiql.herokuapp.com/', {
      ...options,
      body: JSON.stringify({ query }),
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const { data }: { data: T } = await res.json(); // Note: some servers may return errors here as well
    return data;
  } catch (error) {
    console.error(error);
  }
};

const data = query<Pokemon[]>(gql`
  query POKEMON {
    pokemons(first: 151) {
      number
      name
    }
  }
`);
```

### ⚛️ Using React Hooks

```ts
import gql from '@manifoldco/gql-zero';
import React, { useEffect, useReducer } from 'react';

interface UseQueryState<T = null> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

enum Action {
  ERROR = 'ERROR',
  LOADING = 'SUCCESS',
  SUCCESS = 'SUCCESS',
}

type ActionHandler<T> =
  | { type: Action.LOADING }
  | { type: Action.SUCCESS; data: T }
  | { type: Action.ERROR; error: string };

export const makeReducer = <T>() => (
  state: UseQueryState<T>,
  action: ActionHandler<T>
): UseQueryState<T> => {
  switch (action.type) {
    case Action.LOADING:
      return { ...state, data: null, error: null, isLoading: true };
    case Action.SUCCESS:
      return { ...state, data: action.data, error: null, isLoading: false };
    case Action.ERROR:
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
};

const useQuery = <T>(query: string, options: RequestInit = {}): UseQueryState<T> => {
  const initialState: UseQueryState<T> = {
    data: null,
    error: null,
    isLoading: true,
  };
  const reducer = makeReducer<T>();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // loading
    dispatch({ type: Action.LOADING });
    try {
      const res = await fetch('https://pokeapi-graphiql.herokuapp.com/', {
        ...options,
        body: JSON.stringify({ query }),
        headers: {
          ...(options.headers || {}),
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const { data }: { data: T } = await res.json(); // Note: some servers may return errors here as well
      // success
      dispatch({ data, type: Action.SUCCESS });
    } catch (error) {
      // error
      dispatch({ error: error.message, type: Action.ERROR });
    }
  });
};

const ListPokemon: React.FunctionComponent = () => {
  const { isLoading, data, error } = useQuery<Pokemon[]>(gql`
    query POKEMON {
      pokemons(first: 151) {
        number
        name
      }
    }
  `);

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Pokémon Name</th>
          <th>Number</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, number }) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{number}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListPokemon;
```

### Minification

gql-zero can also minify queries, too:

```js
const query = gql`
  query POKEMON {
    pokemons(first: 151) {
      number
      name
    }
  }
`;
minify(query);
```

It’s worth noting that this is **runtime** minification, not **compile-time** minification. For that
reason, you’d really only get benefit from this

## Comparison

Is comparing gql-zero fair to compare to other libraries? **No! This is just a simple string
template!** It doesn’t come close to the features in other libraries. In that regard, this library
is a slimmer version of [graphql-tag][graphql-tag]

Still, this chart is a good reference because few consider the full weight of their GraphQL solution
on the client based on deps and peerDeps.

If you don’t need the extra features, don’t force your users to download them!

| Library                |   Total weight | Weight + `graphql` |
| :--------------------- | -------------: | :----------------: |
| `@manifoldco/gql-zero` | 🔥 `0.4 KB` 🔥 |        N/A         |
| `@apollo/react-hooks`  |      `~ 60 KB` |    `~ 232.7 KB`    |
| `apollo-boost`         |      `90.9 KB` |     `263.6 KB`     |
| `apollo-client`        |      `56.9 KB` |     `229.6 KB`     |
| `apollo-react`         |      `71.6 KB` |     `244.3 KB`     |
| `graphql-tag`          |       `1.9 KB` |      `174.6`       |
| `micro-graphql-react`  |       `8.8 KB` |        N/A         |
| `urql`                 |      `21.5 KB` |     `194.2 KB`     |

_Note: most tools listed depend on `graphql-tag`, which requires `graphql` as a peerDep. If
`graphql-tag` is required, then so is `graphql`._

## About

- [Code of conduct][conduct]
- [Contribution guidelines][contribution]

[conduct]: ./CODE_OF_CONDUCT.md
[contribution]: ./.github/CONTRIBUTING.md
[graphql-tag]: https://www.npmjs.com/package/graphql-tag
