## 🔍 What is `useReducer`?

`useReducer` is a React Hook that manages **state transitions** based on **dispatched actions**.

It’s an alternative to `useState`, especially when:

* The **state is complex or deeply nested**
* Multiple **related values** need to be updated together
* You want to **centralize logic** for state updates

---

## 🧠 Real-World Analogy

Imagine a **traffic controller (reducer)** who receives **instructions (actions)** like:

* `"GO"` → turn light green
* `"STOP"` → turn light red
* `"SLOW"` → turn light yellow

You give instructions, and the controller decides what to do.

That’s how `useReducer` works:

> 🚦 You → `dispatch(action)`
> 🧠 Reducer → `state + action = new state`

---

## 🧩 Why Use `useReducer`?

| Reason                          | Benefit                                                    |
| ------------------------------- | ---------------------------------------------------------- |
| 🔗 Related state logic          | Organize complex or grouped state together                 |
| ✅ Predictable behavior          | Reducers are pure functions — predictable and testable     |
| 🧪 Testability                  | You can unit-test reducer functions without React          |
| 📦 Works well with `useContext` | Ideal for **global state management** like theme/auth/cart |

---

## ⚙️ When to Use vs useState

| Situation                                  | Hook to Use    |
| ------------------------------------------ | -------------- |
| Simple state (single field)                | ✅ `useState`   |
| Complex state (objects, arrays)            | ✅ `useReducer` |
| Related state transitions                  | ✅ `useReducer` |
| You want better testability/predictability | ✅ `useReducer` |

---

## 🛠 Step-by-Step Guide

### 1️⃣ Define the Initial State

```js
const initialState = { count: 0 };
```

---

### 2️⃣ Create the Reducer Function

```js
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}
```

---

### 3️⃣ Use `useReducer` in Component

```js
const [state, dispatch] = useReducer(reducer, initialState);
```

---

### 4️⃣ Dispatch Actions

```jsx
<button onClick={() => dispatch({ type: 'increment' })}>+</button>
```

---

## 🧪 Beginner Code Example — Simple Counter

```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset': return { count: 0 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <h2>Count: {state.count}</h2>
      <button onClick={() => dispatch({ type: 'increment' })}> + </button>
      <button onClick={() => dispatch({ type: 'decrement' })}> - </button>
      <button onClick={() => dispatch({ type: 'reset' })}> Reset </button>
    </div>
  );
}

export default Counter;
```

---

## 📋 Intermediate Example — Form Management

### 📌 Goal: Manage multiple inputs with useReducer

```jsx
const initialState = {
  name: '',
  email: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'set_name':
      return { ...state, name: action.payload };
    case 'set_email':
      return { ...state, email: action.payload };
    default:
      return state;
  }
}

function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <form>
      <input
        type="text"
        value={state.name}
        onChange={(e) => dispatch({ type: 'set_name', payload: e.target.value })}
        placeholder="Name"
      />
      <input
        type="email"
        value={state.email}
        onChange={(e) => dispatch({ type: 'set_email', payload: e.target.value })}
        placeholder="Email"
      />
      <p>Hello {state.name}, your email is {state.email}</p>
    </form>
  );
}
```

---

## 🔗 Advanced Use — Combine `useReducer` with `useContext`

### 📌 Global Auth Example

#### 🔧 `AuthContext.js`

```js
import { createContext } from 'react';
export const AuthContext = createContext();
```

#### 📄 `App.js`

```jsx
const initialAuth = { user: null };

function authReducer(state, action) {
  switch (action.type) {
    case 'login':
      return { user: action.payload };
    case 'logout':
      return { user: null };
    default:
      return state;
  }
}

<AuthContext.Provider value={useReducer(authReducer, initialAuth)}>
  <Navbar />
</AuthContext.Provider>
```

#### 📄 Navbar.js

```jsx
const [authState, dispatch] = useContext(AuthContext);
dispatch({ type: 'login', payload: { name: 'Kishore' } });
```

---

## ⚙️ How `useReducer` Works Internally

* React stores your `state` internally
* On `dispatch(action)`:

  * It calls your `reducer(state, action)`
  * Updates to the new returned state
  * Rerenders the component with new state

---

## 🧠 Best Practices

| Tip                         | Why?                                              |
| --------------------------- | ------------------------------------------------- |
| Use `switch` over `if-else` | More readable and organized                       |
| Keep reducer pure           | No async calls or side effects inside reducer     |
| Use `type` and `payload`    | Makes action handling scalable and consistent     |
| Centralize complex logic    | Your component stays cleaner, reducer holds logic |

---

## ❌ Common Mistakes

| Mistake                  | Correct Way                                          |
| ------------------------ | ---------------------------------------------------- |
| Mutating state directly  | Always return new state object (never modify input)  |
| Doing async/side-effects | Move async outside reducer (into effects/middleware) |
| Missing default return   | Always handle unknown actions with `default:`        |

---

## 🧩 Challenge: Todo App using Only `useReducer`

### 🎯 Requirements:

* Add todo
* Toggle todo completion
* Delete todo
* All using one `useReducer` — no `useState`

---

### 🧠 Setup Structure (High-Level)

```js
const initialState = [];

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case 'toggle':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    case 'delete':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
}
```

Then:

```jsx
const [todos, dispatch] = useReducer(reducer, initialState);

// Dispatch actions like:
dispatch({ type: 'add', payload: 'Learn useReducer' })
dispatch({ type: 'toggle', payload: id })
dispatch({ type: 'delete', payload: id })
```

---

## ✅ Summary: useReducer at a Glance

| Feature        | useReducer Does Well                     |
| -------------- | ---------------------------------------- |
| State grouping | Yes — multiple related states            |
| Predictability | Yes — pure function + action-based       |
| Scalability    | Yes — clean, scalable logic in one place |
| Testing        | Yes — reducer is easily testable         |
| Global state   | Yes — combine with `useContext`          |
