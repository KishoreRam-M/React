import React, { useState } from 'react'

const UseStateComponent = () => {
  const [name, setName] = useState("Kishore");
  const [age, setAge] = useState(20);
  const [student, setStudent] = useState(false);

  const handleUpdate = () => {
    setName("Ram");
    setAge(21);
    setStudent(true);
  };

  return (
    <>
      <div>
        <ul>
          <h1>UseStateComponent</h1>
          <li>My name: {name}</li>
          <li>My age: {age}</li>
          <li>Student? {student ? "Yes" : "No"}</li>
        </ul>

        <button onClick={handleUpdate}>Update Info</button>
      </div>
    </>
  );
};

export default UseStateComponent;
