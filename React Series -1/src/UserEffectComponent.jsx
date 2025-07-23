import React, { useEffect, useState } from 'react';

const UserEffectComponent = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Component Mounted or Count Changed");
  }, [count]); 

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <>
      <div>UserEffectComponent</div>
      <div className="count">Count:</div>
      <div className="mycount">{count}</div>
      <div className="btn">
        <button onClick={handleClick}>Click me</button>
      </div>
    </>
  );
};

export default UserEffectComponent;
