import React, { useState } from 'react';

const ReactForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  // ✅ Proper function declarations
  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleAge = (e) => {
    setAge(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    alert(`You submitted the form.\nName: ${name}\nAge: ${age}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>React Form</h2>

        <input
          type="text"
          required
          value={name}
          onChange={handleName}
          placeholder="Enter your name"
        />

        <br /><br />

        <input
          type="number"
          required
          value={age}
          onChange={handleAge}
          placeholder="Enter your age"
        />

        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ReactForm;
