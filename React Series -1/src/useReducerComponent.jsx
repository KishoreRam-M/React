// useReducerComponent.js
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

const ReducerComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <h2>useReducer Example</h2>
      <h3>Count: {state.count}</h3>
      <div className="mydiv">
        <button onClick={() => dispatch({ type: 'increment' })}>+</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>
    </>
  );
};

export default ReducerComponent;
