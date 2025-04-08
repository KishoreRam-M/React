

## 🔰 Beginner: What is `useEffect`?

`useEffect` is a React **hook** that lets you **run code when something happens** — like when:

- The component **first loads**
- Some **state changes**
- The component is about to **unload**

Think of it like:
> 🔁 “Hey React, after rendering, do this thing.”

---

## ✅ Basic Syntax

```jsx
useEffect(() => {
  // do something
}, [dependencies]);
```

- The **function** runs **after the component renders**
- The **array** controls **when** the code runs

---

## 🟢 Example 1: Run Once When Component Loads

```jsx
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    console.log("Component loaded!");
  }, []); // Empty array = run once

  return <h1>Hello, React!</h1>;
}
```

🧠 Empty `[]` means:
- Run only **once**, like `componentDidMount()` in class components

---

## 🟡 Example 2: Run When State Changes

```jsx
import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Count changed:", count);
  }, [count]); // Runs whenever "count" changes

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </>
  );
}
```

📌 `useEffect` watches the `count`. Every time `count` changes, it runs the code.

---

## 🔴 Example 3: Clean Up (Unsubscribe or Clear)

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Running every 1 second");
  }, 1000);

  // Clean-up function
  return () => {
    clearInterval(timer);
    console.log("Component unmounted or effect re-ran");
  };
}, []);
```

🧽 This is useful for:
- **Timers**
- **Event listeners**
- **API subscriptions**

---

## 🚀 Advanced: API Calls with `useEffect`

```jsx
import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      setUsers(data);
    }

    fetchUsers();
  }, []); // Run once on page load

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔍 How `useEffect` Works Under the Hood

| Dependency Array     | Behavior                                         |
|----------------------|--------------------------------------------------|
| `[]`                 | Runs **once** when component mounts              |
| `[state]`            | Runs **every time that state changes**          |
| Not included         | Runs **every time the component renders**       |
| `return () => {}`    | Runs **before next effect or when unmounting** |

---

## ✅ Best Practices

1. Always **clean up** timers and subscriptions
2. Use **multiple `useEffect`s** for different logic
3. Avoid calling `useEffect` **inside loops or conditions**
4. Wrap async code **inside a function**, don’t make `useEffect` itself `async`

---

## 🧠 When to Use useEffect

| Use Case                    | Should You Use `useEffect`? |
|----------------------------|-----------------------------|
| Fetching API data          | ✅ Yes                      |
| Subscribing to sockets     | ✅ Yes                      |
| Setting a timer            | ✅ Yes                      |
| Updating a state directly  | ❌ No — use event handlers  |
| Reading localStorage       | ✅ Yes                      |

---
