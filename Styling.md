# 🎨 React Styling & 🎯 Event Handling

## ✨ Styling in React

React supports **3 main styling methods**:

---

### 1️⃣ Inline CSS

```jsx
const App = () => {
  const myStyle = {
    color: "white",
    backgroundColor: "black",
    padding: "20px",
    borderRadius: "10px"
  };

  return <h1 style={myStyle}>Inline Styled Component</h1>;
};


const App = () => {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return <button onClick={handleClick}>Click Me</button>;
};

import { useState } from 'react';

const App = () => {
  const [name, setName] = useState('');

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <input type="text" onChange={handleChange} />
      <p>Typed Name: {name}</p>
    </div>
  );
};
