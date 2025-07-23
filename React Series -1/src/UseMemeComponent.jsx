import React, { useState, useMemo } from 'react';

const UseMemoExample = () => {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(false);
const [num ,setnum]=useState(0);
const handleClick= ()=>{
    setnum(num+1);
}


  const expensiveResult = useMemo(() => {
    console.log("🔄 Running expensive calculation...");
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
      result += count * 2;
    }
    return result;
  }, [count]);

  return (
    <div>
      <h2>useMemo Hook Example</h2>
      <p>Count: {count}</p>
      <p>Expensive Result: {expensiveResult}</p>

      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setOther(!other)}>Toggle Other State</button>
    <button onClick={handleClick}>  {num}</button>
    </div>
  );
};

export default UseMemoExample;
