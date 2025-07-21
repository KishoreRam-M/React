You're about to embark on a journey to master one of the most powerful and beloved libraries in the React ecosystem: **React Query**, now known as **TanStack Query** (to reflect its framework-agnostic nature, though we'll focus on React here).

Let's dive in\!

-----

## 🔰 1. Introduction to React Query

### What is React Query?

React Query (TanStack Query for React) is **not a state management library** in the traditional sense (like Redux, Zustand, or Context API for client-side state). Instead, it's a powerful library for **managing server state** in your React applications.

Think of server state as:

  * Asynchronous data (fetched from an API).
  * Data that's owned and persisted by a remote server.
  * Data that needs to be cached, kept "fresh," and potentially updated by multiple users.
  * Data that often needs complex operations like pagination, infinite scrolling, or optimistic updates.

React Query takes care of all the hard parts of server state, allowing you to focus on building your UI.

### Why use it instead of `useEffect` + `useState` for data fetching?

The `useEffect` + `useState` pattern for data fetching is common, but it quickly becomes cumbersome for complex applications. Here's why React Query is a superior choice:

  * **Manual State Management:** With `useEffect` and `useState`, you manually manage `isLoading`, `isError`, `data`, and `error` states. This leads to a lot of repetitive boilerplate.
  * **No Caching:** Data is fetched every time the component mounts or dependencies change. You have to implement caching manually, leading to more complex logic.
  * **Stale Data Issues:** If the same data is needed in multiple parts of your app, `useEffect` will fetch it again and again, leading to potential inconsistencies and unnecessary network requests.
  * **Race Conditions:** Handling multiple fetches and ensuring the correct data is displayed when components re-render can lead to subtle bugs.
  * **Refetching Logic:** Implementing features like refetching on window focus, reconnect, or interval is complex and prone to errors.
  * **Background Updates:** Keeping data fresh in the background without interrupting the user experience is a significant challenge.
  * **Pagination & Infinite Scrolling:** These patterns become very complex to manage manually, especially with caching and prefetching.
  * **Optimistic Updates:** Implementing optimistic UI (showing changes immediately before server confirmation) with rollback logic is extremely tricky without a dedicated library.

React Query abstracts away all this complexity, providing a robust, declarative, and highly optimized solution for managing server state.

### Key features: caching, revalidation, background sync, pagination, etc.

React Query boasts an impressive set of features out-of-the-box:

  * **Caching:** Automatically caches fetched data. If the same data is requested again, it's served instantly from the cache.
  * **Stale-While-Revalidate (SWR):** A powerful pattern where React Query immediately returns cached data (if available) while simultaneously refetching it in the background to ensure it's up-to-date. This provides an incredibly fast user experience.
  * **Automatic Revalidation:**
      * **Window Focus Refetching:** Refetches data when the browser window regains focus.
      * **Network Reconnect Refetching:** Refetches data when the network connection is restored.
      * **Interval Refetching:** Can be configured to refetch data at specified intervals (polling).
  * **Background Synchronization:** Keeps your UI synchronized with your backend data with minimal effort.
  * **Deduplication:** Automatically deduplicates identical requests made at roughly the same time, preventing multiple fetches for the same data.
  * **Mutations:** Provides hooks for creating, updating, and deleting server data, including powerful features like optimistic updates and automatic cache invalidation.
  * **Pagination & Infinite Queries:** Built-in support for handling paginated and infinitely scrolling lists efficiently.
  * **Dependent Queries:** Easily manage queries that depend on the result of other queries.
  * **Parallel Queries:** Fetch multiple queries concurrently.
  * **Error and Loading States:** Provides clear `isLoading`, `isError`, `isSuccess`, `data`, and `error` states, simplifying UI rendering.
  * **Prefetching:** Allows you to fetch data *before* a user navigates to a new page, improving perceived performance.
  * **Query Invalidation:** Manual and automatic mechanisms to mark cached data as stale, prompting a refetch.
  * **Devtools:** Excellent developer tools for inspecting and manipulating the query cache.

-----

## ⚙️ 2. Installation & Setup

Let's get React Query integrated into your React application.

### How to install React Query via NPM/Yarn

First, create a new React project (if you don't have one). For example, with Vite:

```bash
# Using npm
npm create vite@latest my-react-query-app -- --template react-ts
cd my-react-query-app
npm install

# Or using yarn
yarn create vite my-react-query-app --template react-ts
cd my-react-query-app
yarn install
```

Now, install React Query (TanStack Query):

```bash
# Using npm
npm install @tanstack/react-query @tanstack/react-query-devtools

# Using yarn
yarn add @tanstack/react-query @tanstack/react-query-devtools
```

`@tanstack/react-query` is the core library, and `@tanstack/react-query-devtools` provides a fantastic browser extension for debugging.

### How to wrap the app with `QueryClientProvider`

React Query uses a `QueryClient` instance to manage its cache and configuration. This `QueryClient` needs to be provided to your React component tree using `QueryClientProvider`. Typically, you'll wrap your entire application with it.

Open your `src/main.tsx` (or `src/index.tsx`) file:

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Import QueryClient and QueryClientProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 2. Import ReactQueryDevtools for development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 3. Create a QueryClient instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 4. Wrap your App with QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* 5. Add Devtools (optional, but highly recommended for development) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

### Configuring a `QueryClient`

The `QueryClient` constructor accepts an options object where you can define global defaults for your queries and mutations. This is where you set things like default `staleTime`, `cacheTime`, retry logic, etc.

```tsx
// src/main.tsx (updated QueryClient creation)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered "fresh" for 5 seconds.
      // While fresh, data is always read from cache and no network request happens.
      // After 5 seconds, it becomes "stale".
      // When a stale query is mounted or refetched, a background refetch can occur.
      staleTime: 1000 * 5, // 5 seconds

      // Data is kept in cache for 5 minutes after it becomes unused (no active observers).
      // After this time, it's garbage collected.
      gcTime: 1000 * 60 * 5, // 5 minutes

      // Number of times a failed query will retry before erroring out.
      // Default is 3. Set to false to disable retries.
      retry: 3,

      // Whether to refetch on window focus. Default is true.
      refetchOnWindowFocus: true,

      // Whether to refetch when component mounts. Default is true.
      refetchOnMount: true,

      // Whether to refetch when network reconnects. Default is true.
      refetchOnReconnect: true,
    },
    mutations: {
      // Default retry for mutations is 0 (false). Mutations should generally not retry automatically.
      retry: 0,
    },
  },
});
```

### Setting up a basic query

Now that your app is set up, let's make your first query. We'll fetch a list of "todos" from a public API.

```tsx
// src/App.tsx
import { useQuery } from '@tanstack/react-query';

// A simple function to fetch todos
const fetchTodos = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  if (!res.ok) {
    throw new Error('Failed to fetch todos');
  }
  return res.json();
};

function App() {
  // Use the useQuery hook to fetch data
  const {
    data: todos,         // The fetched data
    isLoading,          // true while fetching for the first time
    isFetching,         // true while fetching (including background refetches)
    isError,            // true if an error occurred
    error,              // The error object
    refetch,            // Function to manually refetch the query
  } = useQuery({
    // queryKey: A unique key for this query. React Query uses this for caching.
    // It's an array, allowing for composite keys (e.g., ['todos', todoId]).
    queryKey: ['todos'],
    // queryFn: An asynchronous function that fetches your data.
    queryFn: fetchTodos,
  });

  if (isLoading) return <div>Loading initial todos...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h1>My Todos</h1>
      <button onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? 'Refetching...' : 'Refetch Todos'}
      </button>
      <ul>
        {todos?.map((todo: any) => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? '(Completed)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

-----

## 🔑 3. Core Concepts

Understanding these concepts is crucial for using React Query effectively.

### `useQuery`: Fetching data (GET)

`useQuery` is the primary hook for reading data from your server.

**Signature:**

```typescript
useQuery({
  queryKey: QueryKey; // A unique key (array) for the query
  queryFn: QueryFunction; // An async function that resolves the data
  // ... other options
});
```

**Returns:** An object containing:

  * `data`: The resolved data from `queryFn`.
  * `isLoading`: `true` on the initial fetch when no cached data is available.
  * `isFetching`: `true` whenever the query is currently fetching (initial, background, manual refetch).
  * `isError`: `true` if the `queryFn` throws an error.
  * `error`: The error object.
  * `isSuccess`: `true` if the query successfully fetched data.
  * `status`: `'pending' | 'error' | 'success'`.
  * `refetch`: A function to manually refetch the query.
  * ...and many more.

### `useMutation`: Creating, updating, deleting data (POST/PUT/DELETE)

`useMutation` is for sending data to the server to create, update, or delete resources. Unlike `useQuery`, mutations do not automatically refetch by default.

**Signature:**

```typescript
useMutation({
  mutationFn: MutationFunction; // An async function that performs the mutation
  // ... other options like onSuccess, onError, onSettled, onMutate
});
```

**Returns:** An object containing:

  * `mutate`: The function to trigger the mutation.
  * `mutateAsync`: Similar to `mutate` but returns a promise.
  * `data`: The data returned by the `mutationFn` on success.
  * `isLoading`: `true` while the mutation is in progress.
  * `isError`: `true` if the `mutationFn` throws an error.
  * `error`: The error object.
  * `isSuccess`: `true` if the mutation successfully completed.
  * `status`: `'pending' | 'error' | 'success'`.

### `queryKey` and its role in caching

`queryKey` is the **most important concept** in React Query. It's an **array** that uniquely identifies a piece of data in the cache.

  * **Simple Keys:** `['todos']`, `['users']`
  * **Keys with Variables:** `['todo', todoId]`, `['users', { status: 'active', page: 1 }]`
      * **Order matters for primitives in the array:** `['todo', 1]` is different from `['1', 'todo']`.
      * **Order of properties in objects doesn't matter:** `['users', { status: 'active', page: 1 }]` is the same as `['users', { page: 1, status: 'active' }]`.
  * **Invalidation:** You invalidate queries based on their `queryKey`. If you invalidate `['todos']`, all queries whose keys start with `['todos']` will be marked as stale and potentially refetched.
  * **Deduplication:** React Query uses `queryKey` to deduplicate concurrent requests for the same data.

### `enabled`, `refetch`, `onSuccess`, `onError` options

These are common options you'll use with `useQuery` and `useMutation`.

  * **`enabled` (for `useQuery`):** A boolean that controls whether a query should automatically run.

      * `enabled: true` (default): Query runs immediately.
      * `enabled: false`: Query is "paused" and won't fetch until `enabled` becomes `true` or `refetch()` is called manually. Useful for dependent queries or user-triggered fetches.

  * **`refetch` (returned by `useQuery`):** A function you can call to imperatively refetch the query data.

  * **`onSuccess` (for both `useQuery` and `useMutation`):** A callback function that fires when the query or mutation successfully completes.

      * `useQuery`: `onSuccess(data: TData)`
      * `useMutation`: `onSuccess(data: TData, variables: TVariables, context: TContext | undefined)`

  * **`onError` (for both `useQuery` and `useMutation`):** A callback function that fires if the query or mutation fails.

      * `useQuery`: `onError(error: TError)`
      * `useMutation`: `onError(error: TError, variables: TVariables, context: TContext | undefined)`

### Auto-refetching, stale time, cache time

These are core caching concepts:

  * **`staleTime` (default: `0`ms):** The duration after which a query's data is considered "stale."

      * If `staleTime` is `0` (default), data is *instantly* stale. This means React Query will always try to refetch in the background if there's an active observer and the query is mounted.
      * If `staleTime` is `Infinity`, the data will never be refetched automatically (unless manually invalidated).
      * While data is "fresh" (within `staleTime`), React Query will *always* return the cached data immediately without a network request. This is critical for perceived performance.

  * **`gcTime` (garbage collection time, default: `5` minutes):** The duration after which inactive/unused queries (queries with no active `useQuery` observers) are removed from the cache.

      * If a query becomes inactive, it stays in the cache for `gcTime`. If an observer mounts again within this period, the cached data is instantly available.
      * After `gcTime`, the data is garbage collected, and if an observer mounts again, a full new fetch will occur.
      * `gcTime` is also often referred to as `cacheTime` in older versions or discussions.

**How they work together:**

1.  A `useQuery` mounts and fetches data. It's stored in the cache.
2.  For `staleTime` duration, the data is `fresh`. Any new observer for the same `queryKey` will get the cached data instantly, with no network request.
3.  After `staleTime`, the data becomes `stale`. If a new observer mounts or the window regains focus, the cached data is still returned instantly, but a **background refetch** is triggered to get fresh data.
4.  If all observers for a query unmount, the query becomes `inactive`. It stays in the cache for `gcTime`.
5.  After `gcTime`, the query is garbage collected.

-----

## 🧪 4. Practical Usage (with Examples)

Let's put these concepts into practice.

### Simple GET request with `useQuery`

We already saw this in the basic setup, but here's a dedicated example:

```tsx
// components/PostList.tsx
import { useQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

function PostList() {
  const { data: posts, isLoading, isError, error } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body.substring(0, 50)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
```

### Pagination and infinite queries

React Query makes pagination a breeze.

#### Basic Pagination

```tsx
// components/PaginatedPosts.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPaginatedPosts = async (page: number): Promise<Post[]> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`);
  if (!res.ok) throw new Error(`Failed to fetch posts for page ${page}`);
  return res.json();
};

function PaginatedPosts() {
  const [page, setPage] = useState(1);

  const {
    data: posts,
    isLoading,
    isFetching, // To show loading state during background refetches for new pages
    isError,
    error,
    isPlaceholderData, // True when data is from a placeholder or previous query, not yet fresh
  } = useQuery<Post[], Error>({
    queryKey: ['posts', { page }], // queryKey now includes the page number
    queryFn: () => fetchPaginatedPosts(page),
    placeholderData: (previousData) => previousData, // Keep previous data visible while fetching new page
    // or keepPreviousData: true for v4 and below, now placeholderData
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Paginated Posts</h2>
      {isFetching && isPlaceholderData ? <p>Loading new page...</p> : null}
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body.substring(0, 50)}...</p>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
      >
        Previous Page
      </button>
      <span> Page {page} </span>
      <button
        onClick={() => setPage((prev) => prev + 1)}
        // Disable next button if there are no more posts (basic check)
        disabled={posts?.length === 0 || posts?.length < 5} // Assuming 5 items per page
      >
        Next Page
      </button>
    </div>
  );
}

export default PaginatedPosts;
```

#### Infinite Queries (`useInfiniteQuery`)

Perfect for "load more" buttons or infinite scrolling.

```tsx
// components/InfinitePosts.tsx
import { useInfiniteQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostsPage {
  data: Post[];
  nextCursor: number | undefined;
}

// Simulate an API that returns a cursor for the next page
const fetchInfinitePosts = async (pageParam: number = 0): Promise<PostsPage> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${pageParam}&_limit=5`);
  const data: Post[] = await res.json();
  const nextCursor = data.length > 0 ? pageParam + 5 : undefined; // Simple cursor logic
  return { data, nextCursor };
};

function InfinitePosts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<PostsPage, Error>({
    queryKey: ['infinitePosts'],
    queryFn: ({ pageParam }) => fetchInfinitePosts(pageParam as number),
    initialPageParam: 0, // Starting point for the first query
    getNextPageParam: (lastPage) => lastPage.nextCursor, // Function to get the cursor for the next fetch
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Infinite Posts</h2>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          <ul>
            {page.data.map((post) => (
              <li key={post.id}>
                <strong>{post.title}</strong>
                <p>{post.body.substring(0, 50)}...</p>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
    </div>
  );
}

export default InfinitePosts;
```

### POST/PUT/DELETE with `useMutation`

Here's how to perform mutations and invalidate relevant queries.

```tsx
// components/TodoMutations.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
};

const addTodo = async (newTodo: { title: string }): Promise<Todo> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...newTodo, completed: false, userId: 1 }),
  });
  if (!res.ok) throw new Error('Failed to add todo');
  return res.json();
};

const updateTodo = async (updatedTodo: Todo): Promise<Todo> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTodo),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
};

const deleteTodo = async (todoId: number): Promise<void> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
  // JSONPlaceholder returns an empty object for DELETE, but a real API might return success status.
  return;
};


function TodoMutations() {
  const queryClient = useQueryClient();
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const { data: todos, isLoading, isError, error } = useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const addMutation = useMutation<Todo, Error, { title: string }>({
    mutationFn: addTodo,
    onSuccess: () => {
      // Invalidate the 'todos' query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
    },
    onError: (err) => {
      console.error('Error adding todo:', err.message);
    },
  });

  const updateMutation = useMutation<Todo, Error, Todo>({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err) => {
      console.error('Error updating todo:', err.message);
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err) => {
      console.error('Error deleting todo:', err.message);
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addMutation.mutate({ title: newTodoTitle });
    }
  };

  const handleToggleComplete = (todo: Todo) => {
    updateMutation.mutate({ ...todo, completed: !todo.completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <p>Loading todos...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Todo List</h2>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add new todo"
          disabled={addMutation.isPending}
        />
        <button type="submit" disabled={addMutation.isPending}>
          {addMutation.isPending ? 'Adding...' : 'Add Todo'}
        </button>
        {addMutation.isError && <p style={{ color: 'red' }}>Add Error: {addMutation.error?.message}</p>}
      </form>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
              onClick={() => handleToggleComplete(todo)}
            >
              {todo.title}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              disabled={deleteMutation.isPending}
              style={{ marginLeft: '10px' }}
            >
              {deleteMutation.isPending && deleteMutation.variables === todo.id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      {(updateMutation.isPending || deleteMutation.isPending) && <p>Processing...</p>}
      {updateMutation.isError && <p style={{ color: 'red' }}>Update Error: {updateMutation.error?.message}</p>}
      {deleteMutation.isError && <p style={{ color: 'red' }}>Delete Error: {deleteMutation.error?.message}</p>}
    </div>
  );
}

export default TodoMutations;
```

### Dependent Queries

Fetching data that depends on the result of another query. Use the `enabled` option.

```tsx
// components/UserPosts.tsx
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  userId: number;
}

const fetchUser = async (userId: number): Promise<User> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

const fetchUserPosts = async (userId: number): Promise<Post[]> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user posts');
  return res.json();
};

function UserPosts({ userId }: { userId: number }) {
  // Query 1: Fetch user
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Only fetch user if userId is provided
  });

  // Query 2: Fetch posts, dependent on user data
  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useQuery<Post[], Error>({
    queryKey: ['posts', { userId: user?.id }], // Key depends on fetched user ID
    queryFn: () => fetchUserPosts(user!.id), // Only run if user.id exists
    enabled: !!user?.id, // Only fetch posts if user data is available
  });

  if (isUserLoading) return <p>Loading user...</p>;
  if (isUserError) return <p>Error loading user: {userError.message}</p>;
  if (!user) return <p>No user selected.</p>;

  return (
    <div>
      <h3>Posts by {user.name}</h3>
      {isPostsLoading ? (
        <p>Loading posts for {user.name}...</p>
      ) : isPostsError ? (
        <p>Error loading posts: {postsError.message}</p>
      ) : posts && posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      ) : (
        <p>No posts found for {user.name}.</p>
      )}
    </div>
  );
}

export default UserPosts;
```

### Parallel Queries

Fetch multiple queries simultaneously.

```tsx
// components/ParallelData.tsx
import { useQueries } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

interface Todo {
  id: number;
  title: string;
}

const fetchUser = async (userId: number): Promise<User> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
};

function ParallelData() {
  const [userQuery, todosQuery] = useQueries({
    queries: [
      {
        queryKey: ['user', 1], // Fetch user with ID 1
        queryFn: () => fetchUser(1),
      },
      {
        queryKey: ['todos'], // Fetch todos
        queryFn: fetchTodos,
      },
    ],
  });

  if (userQuery.isLoading || todosQuery.isLoading) {
    return <p>Loading user and todos...</p>;
  }

  if (userQuery.isError) {
    return <p>Error fetching user: {userQuery.error?.message}</p>;
  }

  if (todosQuery.isError) {
    return <p>Error fetching todos: {todosQuery.error?.message}</p>;
  }

  return (
    <div>
      <h2>Parallel Data Fetching</h2>
      {userQuery.data && (
        <p>User: {userQuery.data.name}</p>
      )}
      {todosQuery.data && (
        <div>
          <h4>Todos:</h4>
          <ul>
            {todosQuery.data.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ParallelData;
```

### Error and loading state handling

As seen in previous examples, React Query provides dedicated flags for these:

  * `isLoading`: `true` initially before any data is fetched.
  * `isFetching`: `true` during any fetch operation (initial, background, manual refetch).
  * `isError`: `true` if the query fails.
  * `error`: The error object.
  * `isSuccess`: `true` if the query successfully completed and has data.
  * `status`: `'pending'`, `'error'`, or `'success'`. (More explicit states).

<!-- end list -->

```tsx
// Example within any useQuery component
function MyComponent() {
  const { data, isLoading, isFetching, isError, error, status } = useQuery(...);

  // Using status for more granular control
  if (status === 'pending') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p style={{ color: 'red' }}>An error occurred: {error?.message}</p>;
  }

  // Once status is 'success', data is guaranteed to be available
  return (
    <div>
      {/* Show a subtle loading indicator for background refetches */}
      {isFetching && <small> (Updating in background...)</small>}
      {/* Render data */}
    </div>
  );
}
```

### Prefetching queries

Improve user experience by fetching data before the user needs it (e.g., on hover or before navigating to a new route).

```tsx
// components/PrefetchExample.tsx
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPostById = async (postId: number): Promise<Post> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  if (!res.ok) throw new Error(`Failed to fetch post ${postId}`);
  return res.json();
};

function PostDetail({ postId }: { postId: number }) {
  const { data: post, isLoading, isError, error } = useQuery<Post, Error>({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId, // Only fetch if postId is valid
  });

  if (isLoading) return <p>Loading post {postId}...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!post) return <p>No post selected.</p>;

  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </div>
  );
}

function PrefetchExample() {
  const queryClient = useQueryClient();
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleMouseEnter = async (postId: number) => {
    // Prefetch the query when the user hovers over the link
    await queryClient.prefetchQuery({
      queryKey: ['post', postId],
      queryFn: () => fetchPostById(postId),
      // Optional: Set a short staleTime if you expect the user to navigate quickly
      staleTime: 1000 * 10, // 10 seconds
    });
  };

  return (
    <div>
      <h2>Prefetching Example</h2>
      <p>Hover over a post ID to prefetch its data, then click to view.</p>
      {[1, 2, 3, 4, 5].map((id) => (
        <button
          key={id}
          onClick={() => setSelectedPostId(id)}
          onMouseEnter={() => handleMouseEnter(id)}
          style={{ marginRight: '10px' }}
        >
          Post {id}
        </button>
      ))}

      {selectedPostId && <PostDetail postId={selectedPostId} />}
    </div>
  );
}

export default PrefetchExample;
```

-----

## 🎨 5. Customization & Configuration

### Global query configuration via `QueryClient`

As shown in Section 2, you can set `defaultOptions` on your `QueryClient` instance:

```tsx
// src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds default stale time
      retry: 2, // Retry failed queries twice
      refetchOnMount: false, // Don't refetch on mount by default
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false, // No retries for mutations by default
    },
  },
});
```

You can then override these defaults for individual `useQuery` or `useMutation` calls.

```tsx
// This query will override the global staleTime
const { data } = useQuery({
  queryKey: ['my-special-data'],
  queryFn: fetchSpecialData,
  staleTime: Infinity, // This data never becomes stale automatically
});
```

### Custom retry logic

You can customize `retry` and `retryDelay` at the global or individual query level.

```tsx
// components/CustomRetry.tsx
import { useQuery } from '@tanstack/react-query';

const fetchFailingData = async (): Promise<string> => {
  const random = Math.random();
  if (random < 0.7) { // 70% chance of failure
    console.log('Simulating network error...');
    throw new Error('Network issue or server error!');
  }
  return 'Data fetched successfully!';
};

function CustomRetry() {
  const { data, isLoading, isError, error, isFetching } = useQuery<string, Error>({
    queryKey: ['failingData'],
    queryFn: fetchFailingData,
    retry: (failureCount, error) => {
      // Retry up to 3 times, but only for specific error messages or status codes
      if (failureCount < 3 && error.message.includes('Network')) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff (1s, 2s, 4s, ...) up to 30s
    refetchOnWindowFocus: false, // Disable for this example
  });

  if (isLoading) return <p>Loading data (with custom retry logic)...</p>;
  if (isError) return <p style={{ color: 'red' }}>Error after retries: {error.message}</p>;

  return (
    <div>
      <h2>Custom Retry Logic</h2>
      <p>{data}</p>
      {isFetching && <p>Retrying...</p>}
    </div>
  );
}

export default CustomRetry;
```

### Disabling auto-refetching

You can disable various automatic refetch behaviors:

  * **`refetchOnMount: false`**: Prevents refetching when a component mounts.
  * **`refetchOnWindowFocus: false`**: Prevents refetching when the window regains focus.
  * **`refetchOnReconnect: false`**: Prevents refetching when network connection is restored.
  * **`staleTime: Infinity`**: Data is considered fresh forever, preventing background refetches unless manually invalidated.
  * **`enabled: false`**: Completely prevents the query from running automatically. It will only run when `refetch()` is called.

### Manual cache invalidation

`queryClient.invalidateQueries({ queryKey: [...] })` is your best friend for manual invalidation.

```tsx
// Using useQueryClient hook to get the client instance
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();

  const handleInvalidateAllPosts = () => {
    // Invalidate all queries that start with 'posts'
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const handleInvalidateSpecificPost = (id: number) => {
    // Invalidate a specific post query
    queryClient.invalidateQueries({ queryKey: ['post', id] });
  };

  return (
    <div>
      <button onClick={handleInvalidateAllPosts}>Invalidate All Posts</button>
      <button onClick={() => handleInvalidateSpecificPost(1)}>Invalidate Post 1</button>
    </div>
  );
}
```

### `queryFn` customization and handling different APIs

Your `queryFn` can be any asynchronous function. This means you can use `fetch`, `axios`, or any other data fetching library.

```typescript
// Using fetch (as seen in examples)
const fetchApiData = async () => { /* ... */ };

// Using Axios
import axios from 'axios';
const axiosFetchApiData = async () => {
  const response = await axios.get('https://api.example.com/data');
  return response.data;
};

useQuery({
  queryKey: ['axiosData'],
  queryFn: axiosFetchApiData,
});

// queryFn with parameters from the queryKey
const fetchUserById = async ({ queryKey }) => {
  const [_key, userId] = queryKey; // queryKey will be ['user', 1]
  const res = await fetch(`https://api.example.com/users/${userId}`);
  return res.json();
};

useQuery({
  queryKey: ['user', 1],
  queryFn: fetchUserById,
});
```

-----

## 🔁 6. Advanced Patterns

### Query Invalidation on mutation

This is a fundamental pattern for keeping your UI fresh after data changes on the server. When a mutation succeeds, you invalidate related queries so React Query knows to refetch them.

```tsx
// In the TodoMutations example from before, this is already implemented:

const addMutation = useMutation<Todo, Error, { title: string }>({
  mutationFn: addTodo,
  onSuccess: () => {
    // Invalidate the 'todos' query to refetch the list
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    setNewTodoTitle('');
  },
  onError: (err) => {
    console.error('Error adding todo:', err.message);
  },
});

const updateMutation = useMutation<Todo, Error, Todo>({
  mutationFn: updateTodo,
  onSuccess: () => {
    // Invalidate the general 'todos' list and potentially the specific todo if it was a detail page
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    // If you had a 'todo' detail query, you might also invalidate:
    // queryClient.invalidateQueries({ queryKey: ['todo', updatedTodo.id] });
  },
  onError: (err) => {
    console.error('Error updating todo:', err.message);
  },
});
```

`queryClient.invalidateQueries({ queryKey: ['somePrefix'] })` will invalidate *any* query key that *starts* with `['somePrefix']`. This is powerful for invalidating related data.

### Optimistic updates (with rollback)

Optimistic updates mean updating the UI *before* the server confirms the change. If the server request fails, you roll back the UI. This provides an incredibly fast and responsive user experience.

```tsx
// components/OptimisticTodo.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
};

const updateTodoStatus = async (todo: Todo): Promise<Todo> => {
  // Simulate a random failure for demonstration
  if (Math.random() < 0.3) { // 30% chance of failure
    throw new Error('Simulated network error during update!');
  }
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error('Failed to update todo on server');
  return res.json();
};

function OptimisticTodo() {
  const queryClient = useQueryClient();

  const { data: todos, isLoading, isError, error } = useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const updateMutation = useMutation<Todo, Error, Todo, { previousTodos: Todo[] }>({
    mutationFn: updateTodoStatus,
    onMutate: async (newTodo) => {
      // 1. Cancel any outgoing refetches for this query
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // 2. Snapshot the current cached data
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // 3. Optimistically update the cache
      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(['todos'], (old) =>
          old ? old.map((todo) => (todo.id === newTodo.id ? newTodo : todo)) : []
        );
      }

      // 4. Return a context object with the snapshot
      return { previousTodos: previousTodos || [] };
    },
    onError: (err, newTodo, context) => {
      // 5. On error, roll back to the previous state using the context
      console.error('Optimistic update failed, rolling back:', err.message);
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      // 6. Always refetch the 'todos' query after mutation settles (success or error)
      // This ensures data consistency with the server.
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleToggleComplete = (todo: Todo) => {
    updateMutation.mutate({ ...todo, completed: !todo.completed });
  };

  if (isLoading) return <p>Loading todos...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Optimistic Todo List</h2>
      {updateMutation.isPending && <p>Updating todo optimistically...</p>}
      {updateMutation.isError && <p style={{ color: 'red' }}>Update failed: {updateMutation.error?.message}. Rolled back!</p>}
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
              onClick={() => handleToggleComplete(todo)}
            >
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OptimisticTodo;
```

### Using React Query Devtools

The React Query Devtools are invaluable for understanding and debugging your cache.

To use them, ensure you've imported and rendered `<ReactQueryDevtools />` in your `main.tsx` (as shown in Section 2).

Once running, you'll see a small React Query logo in the corner of your browser (by default, bottom-left). Click it to open the devtools panel.

Inside the devtools, you can:

  * View all active and inactive queries.
  * Inspect query data, status, and options.
  * Manually refetch or remove queries.
  * See mutation history and status.
  * Understand when data is fresh or stale.

### Combining with Form Libraries (like React Hook Form)

React Query handles data fetching and caching, while form libraries like React Hook Form handle form state, validation, and submission. They work together seamlessly.

You'll typically use `useForm` for form state and validation, and then call a `useMutation`'s `mutate` function within your form's `onSubmit` handler.

```tsx
// components/CreateUserForm.tsx
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UserFormInputs {
  name: string;
  email: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = async (userData: UserFormInputs): Promise<User> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...userData, id: Date.now() }), // Simulate ID generation
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
};

function CreateUserForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormInputs>();

  const createMutation = useMutation<User, Error, UserFormInputs>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalidate user list
      reset(); // Clear form fields
      alert('User created successfully!');
    },
    onError: (err) => {
      alert(`Error creating user: ${err.message}`);
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create New User</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {createMutation.isError && <p style={{ color: 'red' }}>{createMutation.error?.message}</p>}
    </form>
  );
}

export default CreateUserForm;
```

### SSR with Next.js and React Query

React Query has excellent support for Server-Side Rendering (SSR) and Static Site Generation (SSG) with frameworks like Next.js. The key idea is to "hydrate" the client-side cache with data fetched on the server.

**Basic Concept:**

1.  On the server, fetch data using `QueryClient.prefetchQuery` or `QueryClient.fetchQuery`.
2.  Serialize the `QueryClient`'s cache.
3.  Pass the serialized cache to the client.
4.  On the client, hydrate a new `QueryClient` instance with the server-side cache.

**Example (Next.js `pages` directory):**

```tsx
// pages/posts/[id].tsx
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPost = async (id: string): Promise<Post> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
};

function PostPageContent({ postId }: { postId: string }) {
  const { data: post, isLoading, isError, error } = useQuery<Post, Error>({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
  });

  if (isLoading) return <div>Loading post...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

// getServerSideProps or getStaticProps
export async function getServerSideProps(context: any) {
  const queryClient = new QueryClient();
  const postId = context.params.id as string;

  await queryClient.prefetchQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      postId, // Pass postId to the component
    },
  };
}

export default function PostPage({ dehydratedState, postId }: { dehydratedState: any, postId: string }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <PostPageContent postId={postId} />
    </HydrationBoundary>
  );
}
```

For the Next.js `app` directory, the approach is slightly different, often involving custom `QueryClientProvider` components and React Server Components. Refer to the official TanStack Query Next.js docs for the latest recommendations.

### Working with WebSockets or polling

React Query is primarily designed for request/response (HTTP) patterns. For real-time data from WebSockets, server-sent events, or frequent polling, you might use a combination of strategies:

  * **Polling (via `refetchInterval`):** For data that updates somewhat frequently, you can use `refetchInterval` in `useQuery`.

    ```tsx
    useQuery({
      queryKey: ['liveData'],
      queryFn: fetchLiveData,
      refetchInterval: 5000, // Refetch every 5 seconds
      // You might set staleTime to 0 or a very low number here
      staleTime: 0,
    });
    ```

  * **Manual Invalidation with WebSockets:** For true real-time, you typically set up a WebSocket connection outside of React Query. When a new message arrives from the WebSocket indicating a data change, you then manually invalidate the relevant query.

    ```tsx
    import { useQueryClient } from '@tanstack/react-query';
    import { useEffect } from 'react';

    function LiveUpdates() {
      const queryClient = useQueryClient();

      useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/realtime-updates');

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'NEW_TODO') {
            // Invalidate the 'todos' query to refetch the latest list
            queryClient.invalidateQueries({ queryKey: ['todos'] });
          } else if (message.type === 'TODO_UPDATED' && message.id) {
            // Invalidate a specific todo query
            queryClient.invalidateQueries({ queryKey: ['todo', message.id] });
            // Optionally, update the cache directly if the payload contains the full updated item
            // queryClient.setQueryData(['todo', message.id], message.payload);
          }
        };

        return () => ws.close();
      }, [queryClient]);

      // Your component rendering logic that uses useQuery(['todos']) etc.
      return (
          // ... (e.g., render your TodoMutations component)
      );
    }
    ```

-----

## 🚀 7. Real-World Use Cases

### Build a mini blog app with React Query (CRUD operations)

**Concepts Covered:** `useQuery` for listing, `useMutation` for create/update/delete, `invalidateQueries` for refetching after mutations, error/loading states.

This can be a larger project, but we've covered the core pieces in the `TodoMutations` and `CreateUserForm` examples.
To extend it to a blog app:

  * **List Posts:** Use `useQuery(['posts'])` to fetch and display all blog posts.
  * **View Single Post:** Use `useQuery(['post', postId])` (dependent query, enabled by `postId`).
  * **Create Post:** Use `useMutation` with `mutationFn: createPost`, `onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })`.
  * **Edit Post:** Use `useMutation` with `mutationFn: updatePost`, `onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); queryClient.invalidateQueries({ queryKey: ['post', postId] }); }`.
  * **Delete Post:** Use `useMutation` with `mutationFn: deletePost`, `onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })`.
  * **Add Comments (nested resource):** `useMutation` for `addComment`, invalidate `['post', postId]` or `['comments', postId]`.

### Dashboard that auto-updates in background

**Concepts Covered:** `refetchInterval`, `refetchOnWindowFocus`, `staleTime`.

```tsx
// components/DashboardStats.tsx
import { useQuery } from '@tanstack/react-query';

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  newSignupsToday: number;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate API call that updates frequently
  const res = await new Promise<Response>((resolve) =>
    setTimeout(() => {
      resolve(new Response(JSON.stringify({
        totalUsers: 1000 + Math.floor(Math.random() * 50),
        activeSessions: 10 + Math.floor(Math.random() * 10),
        newSignupsToday: Math.floor(Math.random() * 5),
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }, 500)
  );
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
};

function DashboardStats() {
  const { data, isLoading, isError, error, isFetching } = useQuery<DashboardStats, Error>({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 1000 * 10, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 1000 * 5, // Data is stale after 5 seconds, allowing background updates
  });

  if (isLoading) return <p>Loading dashboard stats...</p>;
  if (isError) return <p>Error loading stats: {error.message}</p>;

  return (
    <div>
      <h2>Live Dashboard Stats {isFetching && <small>(updating...)</small>}</h2>
      {data && (
        <>
          <p>Total Users: <strong>{data.totalUsers}</strong></p>
          <p>Active Sessions: <strong>{data.activeSessions}</strong></p>
          <p>New Signups Today: <strong>{data.newSignupsToday}</strong></p>
        </>
      )}
    </div>
  );
}

export default DashboardStats;
```

### Admin panel with paginated data and search

**Concepts Covered:** `useQuery` with `queryKey` for pagination and search, `placeholderData` (or `keepPreviousData`).

```tsx
// components/AdminPanel.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce'; // You might need to install this: npm i use-debounce

interface User {
  id: number;
  name: string;
  email: string;
}

const fetchUsers = async (page: number, search: string): Promise<User[]> => {
  const queryParams = new URLSearchParams({
    _limit: '10',
    _page: String(page),
  });
  if (search) {
    queryParams.append('name_like', search); // Simulate search by name
  }
  const res = await fetch(`https://jsonplaceholder.typicode.com/users?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

function AdminPanel() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search input

  const {
    data: users,
    isLoading,
    isFetching,
    isError,
    error,
    isPlaceholderData,
  } = useQuery<User[], Error>({
    queryKey: ['adminUsers', { page, search: debouncedSearchTerm }], // Query key includes search & page
    queryFn: () => fetchUsers(page, debouncedSearchTerm),
    placeholderData: (previousData) => previousData, // Keep previous data visible
    // For v4 and below, you would use: keepPreviousData: true
  });

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Admin Panel - Users</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // Reset to page 1 on new search
        }}
        style={{ marginBottom: '10px', width: '300px' }}
      />
      {isFetching && isPlaceholderData ? <p>Loading data...</p> : null}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
          {users?.length === 0 && (
            <tr>
              <td colSpan={3}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <span> Page {page} </span>
      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={users?.length === 0 || users?.length < 10} // Assuming 10 items per page
      >
        Next
      </button>
    </div>
  );
}

export default AdminPanel;
```

-----

## 📦 8. Performance & Production Tips

### Code splitting queries

You often don't need all your `useQuery` or `useMutation` hooks immediately on initial page load. You can code-split components that use these hooks, so their logic and data fetching only load when the component is actually rendered.

```tsx
// App.tsx (example)
import React, { lazy, Suspense } from 'react';

const PostList = lazy(() => import('./components/PostList'));
const TodoMutations = lazy(() => import('./components/TodoMutations'));

function App() {
  return (
    <div>
      <h1>My Application</h1>
      <Suspense fallback={<div>Loading posts section...</div>}>
        <PostList />
      </Suspense>
      <Suspense fallback={<div>Loading todos section...</div>}>
        <TodoMutations />
      </Suspense>
    </div>
  );
}
```

### Reduce unnecessary re-fetching

  * **Adjust `staleTime`:** Increase `staleTime` for data that doesn't change often. If `staleTime` is longer, React Query will serve from cache more frequently without a background refetch.
  * **Disable unwanted refetches:** Use `refetchOnMount: false`, `refetchOnWindowFocus: false`, `refetchOnReconnect: false` if those behaviors are not desired for specific queries.
  * **`enabled: false`:** For queries that should only run on explicit user action.

### Avoiding waterfall fetching

Waterfall fetching occurs when one API request depends on the result of a previous one, leading to sequential fetches that slow down load times.

  * **Dependent Queries:** While `enabled` helps, try to parallelize as much as possible. If `A` needs `B`, but `C` also needs `B`, `A` and `C` can run in parallel if they both just need `B`'s ID.
  * **`useQueries`:** Use `useQueries` for independent parallel fetches.
  * **Transforming data on the server:** Sometimes, it's better to fetch combined data from a single, optimized endpoint on your backend rather than chaining multiple frontend requests.

### Using selectors to limit re-renders

By default, when `useQuery` data updates, the component re-renders. If you only need a small part of the large data object, you can use the `select` option to extract only the necessary piece. This can prevent unnecessary re-renders in components that don't care about the full data.

```tsx
// components/UserDisplayName.tsx
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  address: { street: string; city: string; }; // More complex data
}

const fetchUser = async (userId: number): Promise<User> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

function UserDisplayName({ userId }: { userId: number }) {
  // Use a selector to only subscribe to the 'name' property
  const { data: userName, isLoading, isError, error } = useQuery<User, Error, string>({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name, // Only return the name property
    staleTime: Infinity, // Name won't change often, prevent refetches
  });

  if (isLoading) return <p>Loading user name...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return <p>User Name: {userName}</p>;
}

export default UserDisplayName;
```

If the `user` object's `address` or `email` changes, `UserDisplayName` won't re-render because it only "selected" the `name` property.

### Query deduplication

React Query automatically deduplicates requests with the same `queryKey` that occur within a short time frame (default: 500ms). This prevents your app from making multiple identical network requests if, for example, two components mount at slightly different times and both request `['todos']`.

This is a built-in feature you generally don't need to configure, but it's important to be aware of its benefit.

-----

## 📘 Bonus

### Links to official docs and GitHub examples

  * **Official Documentation (TanStack Query):** [https://tanstack.com/query/latest/docs/react/overview](https://www.google.com/search?q=https://tanstack.com/query/latest/docs/react/overview) (This is your ultimate resource\!)
  * **GitHub Repository:** [https://github.com/TanStack/query](https://github.com/TanStack/query)
  * **Awesome React Query:** [https://github.com/Buuntu/awesome-react-query](https://github.com/Buuntu/awesome-react-query) (Community-curated list of resources, examples, and articles).

### TanStack Query Devtools

  * **NPM Package:** [https://www.npmjs.com/package/@tanstack/react-query-devtools](https://www.npmjs.com/package/@tanstack/react-query-devtools)
  * Remember to add `<ReactQueryDevtools initialIsOpen={false} />` to your `QueryClientProvider` setup.

### Migration tips from other fetching libs like Axios + Redux

Migrating to React Query often means *removing* a lot of boilerplate code:

1.  **Identify Server State:** Distinguish between true server state (data fetched from an API) and client-side UI state. React Query handles server state; you'll still need `useState` or a client-side state manager for things like form inputs, modal open/close states, etc.
2.  **Remove `redux-thunk`/`redux-saga`/`redux-observable`:** These are typically used for managing asynchronous side effects related to data fetching. React Query handles all of this internally.
3.  **Replace `isLoading`/`isError`/`data` states:** Your custom Redux reducers and selectors for fetching status can be replaced by React Query's hooks (`isLoading`, `isError`, `data`).
4.  **Adopt `queryKey`:** Start thinking in `queryKey` arrays. This is fundamental for caching and invalidation.
5.  **Re-evaluate Caching Logic:** Most of your custom caching logic can be removed. React Query's `staleTime` and `gcTime` handle caching automatically.
6.  **Mutations instead of "update" actions:** Replace Redux actions like `UPDATE_TODO_REQUEST`, `UPDATE_TODO_SUCCESS`, `UPDATE_TODO_FAILURE` with a single `useMutation` call. Use `onSuccess`, `onError`, `onSettled` callbacks.
7.  **Embrace `invalidateQueries`:** Instead of dispatching actions to manually update Redux store after a successful mutation, use `queryClient.invalidateQueries` to tell React Query to refetch the affected data.
8.  **Optimistic Updates:** If you had complex optimistic update logic, React Query's `onMutate` and `onError` callbacks (with context for rollback) simplify this significantly.

**General Approach:** Start by migrating GET requests using `useQuery`. Once comfortable, move to mutations (`useMutation`). For complex areas like pagination or optimistic updates, tackle them incrementally.

### Community best practices

  * **Query Keys are Paramount:** Spend time defining clear, consistent, and granular `queryKey` arrays. They are the backbone of React Query's caching system.
  * **Colocate Data Fetching:** Define your `queryFn` directly with your `useQuery` call or in a custom hook. This keeps related logic together.
  * **Custom Hooks for Reusability:** Encapsulate your `useQuery` and `useMutation` logic into custom hooks (e.g., `usePosts`, `useCreatePost`). This promotes reusability and keeps your components clean.
  * **Embrace Stale-While-Revalidate:** Understand and leverage `staleTime` to provide an instant UI experience while ensuring data freshness.
  * **Use Devtools Extensively:** The React Query Devtools are incredibly powerful for understanding the state of your cache and debugging.
  * **Don't Over-Optimize Initially:** Start with sensible `staleTime` and `gcTime` defaults. Only customize when you identify specific performance bottlenecks or requirements.
  * **Handle Errors Gracefully:** Always include `isError` and `error` handling in your components.
  * **Consider `networkMode`:** For advanced scenarios (e.g., offline-first), `networkMode` can control how queries behave in different network conditions.

-----

You now have a comprehensive understanding of React Query, from its fundamental concepts to advanced patterns and real-world applications. The key is to **practice** and build small applications using these concepts. Happy coding\!
