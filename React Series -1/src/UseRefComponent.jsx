import React, { useRef } from 'react';

const UseRefComponent = () => {
  // Step 1: Create a ref to access the input DOM element
  const inputRef = useRef(null);

  const handleFocus = () => {
  inputRef.current.focus(); // Focus input
  console.log('Input is now focused:', inputRef.current.value);
};


  return (
    <>
      <h2>useRef Hook Example</h2>
      <input
        type="text"
        ref={inputRef}
        placeholder="Write something..."
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={handleFocus}>Focus Input</button>
    </>
  );
};

export default UseRefComponent;
