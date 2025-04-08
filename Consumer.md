## 🎯 What is `.Consumer` in Context API?

`Context.Consumer` is a component that lets you **subscribe to context changes**. You wrap your JSX with it and use a function to access the context value.

> ✅ Mostly used in **class components** or when you're not using hooks like `useContext`.

---

## 🛠️ Syntax

```jsx
<MyContext.Consumer>
  {value => (
    // Use the context value here
  )}
</MyContext.Consumer>
```

---

## ✅ Example Using `Consumer`

### 👇 Step-by-step

### 1. Create Context

```jsx
import React from 'react';

export const UserContext = React.createContext();
```

---

### 2. Provide Context in App

```jsx
import React from 'react';
import { UserContext } from './UserContext';
import Profile from './Profile';

const App = () => {
  return (
    <UserContext.Provider value={{ name: "Kishore", age: 21 }}>
      <Profile />
    </UserContext.Provider>
  );
};

export default App;
```

---

### 3. Consume Context using `.Consumer`

```jsx
import React from 'react';
import { UserContext } from './UserContext';

const Profile = () => {
  return (
    <UserContext.Consumer>
      {user => (
        <h2>
          Hello, {user.name}! You are {user.age} years old.
        </h2>
      )}
    </UserContext.Consumer>
  );
};

export default Profile;
```

---

## 📌 When to Use `.Consumer`

| Scenario                  | Use `Consumer`? |
|---------------------------|-----------------|
| Functional component w/hooks | ❌ Use `useContext` instead |
| Class component            | ✅ Yes |
| Need fine-grained control  | ✅ Optional |
| Simple access to context   | ❌ Hooks are cleaner |

---

## 🆚 Consumer vs useContext

| Feature         | `useContext()`            | `Context.Consumer`        |
|----------------|---------------------------|----------------------------|
| Used in         | Functional components     | Functional & class components |
| Syntax          | Clean & direct            | Verbose with render prop   |
| Modern approach | ✅ Yes                    | ❌ Legacy / fallback        |

---

## 💡 Tip: You Can Nest Consumers

For using multiple contexts:

```jsx
<ThemeContext.Consumer>
  {theme => (
    <UserContext.Consumer>
      {user => (
        <div style={{ background: theme.bg }}>
          Hello, {user.name}
        </div>
      )}
    </UserContext.Consumer>
  )}
</ThemeContext.Consumer>
```
