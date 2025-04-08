

## 🧠 1. What are Props?

### 🔧 Think of `props` as **inputs to components**  
They allow you to **pass data from parent → child**.

---

### 🔍 Real-life Analogy:
A **TV Remote** sends signals (props) to a **TV (component)** to change channel, volume, etc.

---

### ✅ Basic Example

```jsx
const Welcome = (props) => {
  return <h1>Hello {props.name}!</h1>;
};

const App = () => {
  return <Welcome name="Kishore" />;
};
```

- `name="Kishore"` → passed as prop to `<Welcome />`
- `props.name` = `"Kishore"`

---

## 🟡 2. Destructuring Props (Cleaner Code)

```jsx
const Welcome = ({ name }) => {
  return <h1>Hello {name}!</h1>;
};
```

🔥 Destructuring makes code neat and readable.

---

## 🟠 3. Passing Multiple Props

```jsx
const Profile = ({ name, age }) => {
  return <p>{name} is {age} years old.</p>;
};

const App = () => {
  return <Profile name="Ram" age={21} />;
};
```

---

## 🔴 4. defaultProps — Provide Defaults

What if a parent **forgets** to pass a prop? 😬  
Let’s fix it with `defaultProps`.

```jsx
const Greet = ({ name }) => {
  return <h2>Hello {name}</h2>;
};

Greet.defaultProps = {
  name: "Guest",
};

const App = () => {
  return <Greet />; // shows "Hello Guest"
};
```

✅ Useful for fallback values  
✅ Works with missing props

---

## 🔵 5. propTypes — Type Checking for Props 🧪

Imagine passing `age="twenty"` instead of a number... uh-oh!  
`propTypes` gives **warnings** to catch these bugs early.

```bash
npm install prop-types
```

```jsx
import PropTypes from "prop-types";

const Profile = ({ name, age }) => {
  return <h3>{name} is {age} years old</h3>;
};

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
};
```

✅ Warns if wrong type is passed  
✅ Warns if required prop is missing

---

## 🔥 Bonus: All-in-One Example

```jsx
import PropTypes from 'prop-types';

const Card = ({ title, content }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
};

Card.defaultProps = {
  title: "Default Title",
  content: "This is some default content.",
};

Card.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

const App = () => {
  return <Card title="My Blog Post" />;
};
```

---



## ⚠️ Common Mistakes

❌ Forgetting `propTypes`  
❌ Not using `defaultProps`  
❌ Passing wrong types (like string instead of number)

---

Want me to build a real mini project using all 3 together like a **Blog App** or **User Cards**? Just say “go for it bro” 💪😎
