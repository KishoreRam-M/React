import React, { useState } from 'react';

const TextInputExample = () => {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value); // e.target.value gets the current value of the input
  };

  return (
    <div>
      <input type="text" value={text} onChange={handleChange} placeholder="Enter text" />
      <p>You typed: {text}</p>
    </div>
  );
};

export default TextInputExample;
