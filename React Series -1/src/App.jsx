import React from 'react';
import ReducerComponent from './useReducerComponent'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PropsComponent from './PropsComponent';
import ReduxComponent from './ReduxComponent';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReducerComponent />} />
        <Route path="/home" element={<PropsComponent />} />
                <Route path="/redux" element={<ReduxComponent />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
