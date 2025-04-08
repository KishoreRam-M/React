Let’s **master Conditional Rendering in React** — from beginner to advanced level — with 🔥 examples, real-life analogies, and clean code!

---

## 🧠 What is Conditional Rendering?

**Conditional rendering** = Showing different things on the screen **based on a condition** (like `if`, `else`, etc.)

Just like in real life:

> “If it’s raining ☔️, I’ll carry an umbrella. Else ☀️, I wear sunglasses.”

In React:
```jsx
{isRaining ? <Umbrella /> : <Sunglasses />}
```

---

# 🟢 1. Beginner: Using `if` Outside JSX

```jsx
const App = () => {
  const isLoggedIn = true;
  let content;

  if (isLoggedIn) {
    content = <h2>Welcome back!</h2>;
  } else {
    content = <h2>Please log in</h2>;
  }

  return <div>{content}</div>;
};
```

---

# 🟡 2. Intermediate: Ternary Operator `? :` inside JSX

```jsx
const App = () => {
  const isAdmin = false;

  return (
    <div>
      <h1>{isAdmin ? "Welcome Admin" : "Welcome User"}</h1>
    </div>
  );
};
```

✅ Cleaner  
✅ One-liner logic  
✅ Great for showing **either this or that**

---

# 🟠 3. Show/Hide with `&&` (short-circuiting)

```jsx
const App = () => {
  const isLoggedIn = true;

  return (
    <div>
      <h1>Dashboard</h1>
      {isLoggedIn && <button>Logout</button>}
    </div>
  );
};
```

✅ Show something **only if** a condition is true  
✅ If `false`, shows nothing

---

# 🔴 4. Advanced: Conditional Components

```jsx
const UserGreeting = () => <h2>Welcome back!</h2>;
const GuestGreeting = () => <h2>Please sign up.</h2>;

const Greeting = ({ isLoggedIn }) => {
  return isLoggedIn ? <UserGreeting /> : <GuestGreeting />;
};

const App = () => {
  return <Greeting isLoggedIn={true} />;
};
```

✅ This pattern is **very reusable**  
✅ Makes code modular

---

# 🟣 5. Multiple Conditions (Switch / if-else ladder)

```jsx
const getColor = (theme) => {
  switch (theme) {
    case "light":
      return "☀️ Light Mode";
    case "dark":
      return "🌙 Dark Mode";
    case "blue":
      return "🌊 Blue Mode";
    default:
      return "🧱 Default Mode";
  }
};

const App = () => {
  const theme = "dark";

  return <h1>{getColor(theme)}</h1>;
};
```

✅ Perfect when you have **many options**

---

# 🔵 6. Conditional Styling (inline)

```jsx
const App = () => {
  const isOnline = true;

  return (
    <div style={{ color: isOnline ? "green" : "red" }}>
      {isOnline ? "Online" : "Offline"}
    </div>
  );
};
```

---

# 🧪 BONUS: Loading Spinner or Placeholder

```jsx
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // simulate API
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : <h2>Data Loaded ✅</h2>}
    </div>
  );
};
```

---
