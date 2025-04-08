Let's **master the React Context API** from **beginner to advanced** level, step-by-step with code examples, visuals, and real-world use cases 💡🔥

---

## 🧠 What is Context API?

React Context API is a way to **pass data through the component tree** without having to manually pass props at every level.  
> 🔄 "Global state for your component tree"

---

## 📦 Why Use It?

Imagine you have a theme, user info, or language setting that many components need. Instead of **"prop drilling"** (passing down through many levels), Context API lets you:

✅ Define it once  
✅ Access it anywhere

---

## 🌱 Beginner: Basic Usage in 3 Steps

---

### 📍 Step 1: Create the Context

```jsx
import React, { createContext } from "react";

export const UserContext = createContext();
```

---

### 📍 Step 2: Create a Provider

Wrap your app (or part of it) with `UserContext.Provider` and pass a value.

```jsx
import React from "react";
import { UserContext } from "./UserContext";
import Home from "./Home";

const App = () => {
  return (
    <UserContext.Provider value={{ name: "Kishore", age: 21 }}>
      <Home />
    </UserContext.Provider>
  );
};

export default App;
```

---

### 📍 Step 3: Use the Context in a Child Component

```jsx
import React, { useContext } from "react";
import { UserContext } from "./UserContext";

const Home = () => {
  const user = useContext(UserContext);
  return <h2>Welcome {user.name} 👋, age: {user.age}</h2>;
};

export default Home;
```

---

## 🚀 Intermediate: Nesting & Updating Context

### 🔁 Updating Context Dynamically

```jsx
import React, { useState, createContext } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

Use in any component:

```jsx
import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

const ThemeToggler = () => {
  const { dark, setDark } = useContext(ThemeContext);
  return (
    <button onClick={() => setDark(!dark)}>
      Switch to {dark ? "Light" : "Dark"} Mode
    </button>
  );
};
```

---

## 🔥 Advanced: Custom Hooks for Context

Instead of writing `useContext(YourContext)` everywhere, we can abstract it:

```jsx
// useUser.js
import { useContext } from "react";
import { UserContext } from "./UserContext";

export const useUser = () => useContext(UserContext);
```

Now simply use:

```jsx
const user = useUser();
```

---

## 📦 Real World Use Cases

| Use Case        | Context Name         |
|------------------|----------------------|
| User Login Info  | `UserContext`        |
| Theme Switcher   | `ThemeContext`       |
| Language Setting | `LocaleContext`      |
| Cart Data        | `CartContext`        |

---

## ⚠️ When **Not** to Use Context

❌ If data is only used in 1–2 components, context is **overkill**  
❌ Context triggers re-renders — for big apps, consider **Redux** or **Zustand**  
❌ Avoid putting **frequently changing values** in context (e.g., mouse position)

---

## 🧪 Best Practices

✅ Split context into Provider + Hook  
✅ Avoid unnecessary re-renders  
✅ Use `memo`, `useCallback` to optimize  
✅ Structure context files like:

```
contexts/
  └─ UserContext.js
  └─ ThemeContext.js
  └─ useUser.js
```

---

## 🏁 Summary

| Feature           | Purpose                              |
|-------------------|--------------------------------------|
| `createContext()` | Creates context                      |
| `.Provider`       | Provides value to all children       |
| `useContext()`    | Consumes the context inside component |
| Custom Hook       | Clean, reusable way to consume context |

---

