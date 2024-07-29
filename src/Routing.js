import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/screens/home";
import SignIn from "./components/screens/SignIn";
import SignUp from "./components/screens/SignUp";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile"
import { UserContext } from "./App";
import SubscribedUserPost from "./components/screens/SubscribedUserPosts"

const Routing = () => {
  const { state } = useContext(UserContext);
  const navigate = useNavigate();
  // console.log("Routing component rendered");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user && !window.location.pathname.startsWith("/signin")) 
    {
      navigate("/signup"); // Navigate to sign-in page if user is not authenticated
    }
  }, [state, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myfolloweringpost" element={<SubscribedUserPost />} />
    </Routes>
  );
};

export default Routing;
