# 🧠 `useEffect` vs. `useLayoutEffect` — Made Simple

---

## ⚙️ Key Difference: When They Run

| Hook              | Timing                                          | Blocking? |
|-------------------|--------------------------------------------------|-----------|
| `useEffect`       | ✅ **After** DOM update **and** browser **paint** | ❌ No      |
| `useLayoutEffect` | ⚠️ **After** DOM update, **before** browser paint | ✅ Yes     |

---

## 🎨 What is "Browser Paint"?

> 🔄 React updates the Virtual DOM → Updates the Real DOM → 🖼️ **Browser paints** (updates what the user sees)

- `useLayoutEffect` runs **before** browser paint ⏱️ (synchronous)
- `useEffect` runs **after** paint is done ✅ (asynchronous)

---

## ✅ Use `useEffect` — Most of the Time

Best for logic that **does not affect the layout immediately**:

- Fetching API data
- Logging/debugging
- Subscriptions
- Updating document title
- Timers or intervals

```js
useEffect(() => {
  document.title = "New Page Title";
}, []);
````

---

## 🔁 Use `useLayoutEffect` — Only If Needed

Best when you need to **read or measure the DOM** before it's visible:

* Tooltip or popover positioning
* Prevent layout "flickers"
* Smooth entrance animations
* Manually calculating height, width, or scroll position

```jsx
useLayoutEffect(() => {
  const rect = tooltipRef.current.getBoundingClientRect();
  setTooltipStyle({
    top: -rect.height - 10 + 'px',
    position: 'absolute'
  });
}, []);
```

⚠️ Using `useEffect` in the above case might cause **a flash** or incorrect tooltip position.

---

## ⚠️ Performance Tip

* ✅ `useEffect` is **non-blocking**, runs after the screen updates
* ❌ `useLayoutEffect` is **blocking**, it **freezes paint** — don't overuse

---

## 🧾 Quick Recap Table

| Aspect           | `useEffect`                          | `useLayoutEffect`             |
| ---------------- | ------------------------------------ | ----------------------------- |
| ⏱️ Timing        | After browser paint                  | Before browser paint          |
| 🔄 Async/Sync    | Asynchronous                         | Synchronous                   |
| 🚫 Blocks Paint? | ❌ No                                 | ✅ Yes                         |
| 💡 Ideal For     | Data fetching, logging, side effects | Layout reading or corrections |
| 📌 Use When      | No visual glitch expected            | Visual glitch/layout flicker  |

---

## 🎯 Rule of Thumb

> 🟢 **Start with `useEffect`**
> 🔄 **Use `useLayoutEffect` only if layout breaks or flickers visually**

---

## 🧪 Mini Exercise

```jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

function Box() {
  const boxRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const rect = boxRef.current.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
  }, []);

  return (
    <div ref={boxRef} style={{ width: 200, height: 100, background: "skyblue" }}>
      Width: {size.width}px, Height: {size.height}px
    </div>
  );
}
```

🧠 In this case, `useLayoutEffect` ensures you read correct layout values **before** the browser paints.

---

## 📘 Recommended Practice

* Try switching between `useEffect` and `useLayoutEffect` and observe visual changes.
* Only use `useLayoutEffect` when required — don’t block rendering unnecessarily.

---

📌 This material is best suited for:

* Interviews
* React developer onboarding
* Real-world UI performance tuning
* Academic explanations and viva questions
