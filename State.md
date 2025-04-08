

### 📘 What is "State" in React?

> **State** is an object in a React component that holds **data that changes over time** and controls the **behavior & appearance** of the UI.

---

## 🟢 1. Beginner Level — `useState`

### ✅ Basic Counter Example

```jsx
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0); // [value, updater]

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};
```

### 🧠 How `useState` Works:

- `useState(initialValue)` returns:
  - **state value**
  - **function to update it**
- React **re-renders the component** when state changes.

---

### ✅ Input Field Example

```jsx
const App = () => {
  const [name, setName] = useState("");

  return (
    <>
      <input onChange={(e) => setName(e.target.value)} />
      <p>You typed: {name}</p>
    </>
  );
};
```

---

## 🟡 2. Intermediate Level — State with Objects & Arrays

### ✅ Object State

```jsx
const App = () => {
  const [user, setUser] = useState({ name: "", age: 0 });

  const updateName = (e) => setUser({ ...user, name: e.target.value });

  return (
    <>
      <input onChange={updateName} />
      <p>Name: {user.name}</p>
    </>
  );
};
```

> Always use `...spread` when updating part of an object.

---

### ✅ Array State

```jsx
const App = () => {
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  return (
    <>
      <button onClick={addItem}>Add Item</button>
      <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </>
  );
};
```

---

## 🔵 3. Advanced Level — `useReducer`, `useContext`, Global State

---

### ✅ `useReducer` — For Complex Logic

```jsx
import { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    default: return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <h1>Count: {state.count}</h1>
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
    </>
  );
};
```

> Use `useReducer` when:
> - You have multiple state values
> - Complex update logic
> - State is an object or array

---

### ✅ `useContext` — Sharing State Globally

#### 1. Create a Context

```jsx
import { createContext } from 'react';

export const ThemeContext = createContext();
```

#### 2. Provide the Context

```jsx
import { ThemeContext } from './ThemeContext';

const App = () => {
  return (
    <ThemeContext.Provider value={"dark"}>
      <Header />
    </ThemeContext.Provider>
  );
};
```

#### 3. Consume with `useContext`

```jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Header = () => {
  const theme = useContext(ThemeContext);
  return <h1>Current Theme: {theme}</h1>;
};
```

---

## 🧠 Bonus: Third-Party State Managers

| Tool        | Use Case                          |
|-------------|-----------------------------------|
| Redux       | Complex app-wide state            |
| Zustand     | Minimal, scalable state manager   |
| Recoil      | React-friendly state management   |
| Jotai       | Atomic state management           |
| React Query | Caching & server state (APIs)     |

