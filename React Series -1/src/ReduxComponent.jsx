import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInfo } from './slice'; // adjust path as needed

const ReduxComponent = () => {
  const users = useSelector((state) => state.myUser.myUser);
  const dispatch = useDispatch();

  const [info, setInfo] = useState({
    name: '',
    email: '',
    number: ''
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value
    }));
    console.log( {[name]:value});
  };

  const handleSubmit = () => {
    if (info.name && info.email && info.number) {
      dispatch(setInfo(info));
      setInfo({ name: '', email: '', number: '' });
    }
  };

  return (
    <>
      <div className="info">
        <input
          type="text"
          placeholder="Enter your name"
          name="name"
          value={info.name}
          onChange={onChange}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          name="email"
          value={info.email}
          onChange={onChange}
          required
        />
        <input
          type="number"
          placeholder="Enter your number"
          name="number"
          value={info.number}
          onChange={onChange}
          required
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div>
        <h3>Users in Redux:</h3>
        <ul>
          {users.map((u, index) => (
            <li key={index}>
              {u.name} - {u.email} - {u.number}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ReduxComponent;
