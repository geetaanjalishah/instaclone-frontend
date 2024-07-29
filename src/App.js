import React, { createContext, useReducer } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import { initialState, reducer } from "./reducer/userReducer";

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log("App component rendered");

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
