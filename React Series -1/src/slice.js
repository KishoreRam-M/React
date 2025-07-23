import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myUser: [
    {
   name: "Kishore Ram M",
      email: "kishore@example.com",
      number: "9876543210"
    }
 
  ],
};

const userSlice = createSlice({
  name: "userinfo",
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.myUser = [...state.myUser, action.payload];
    },
  },
});

export const { setInfo } = userSlice.actions;
export default userSlice.reducer;
