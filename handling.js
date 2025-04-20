import React, { useState } from "react";

const Home = () => {
  const [formInput, setFormInput] = useState({ name: "", age: "", email: "" });

  function handle(event) {
    const{name,value}= event.target;
    console.log(name,value);
  }

  return (
    <>
      <label htmlFor="">Name:</label>
      <br />
      <input type="text" name="name" value={formInput.name} onChange={handle} />
      <br />
      <label htmlFor="">Age:</label>
      <br />
      <input type="number" name="age" value={formInput.age} onChange={handle} />
      <br />
      <label htmlFor="">Email:</label>
      <br />
      <input
        type="text"
        name="email"
        value={formInput.email}
        onChange={handle}
      />
      <br />
      <button type="submit">Add</button>
    </>
  );
};

export default Home;
