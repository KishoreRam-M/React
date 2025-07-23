import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice"; 
const store = configureStore({
  reducer: {
    myUser: userReducer,
  },
});

export default store;
