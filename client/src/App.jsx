import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import ProtectedRoute from "./Route/ProtectedRoute.jsx";
import Myblog from "./pages/Myblog";
import CreateBlog from "./components/CreateBlog";

function App() {
  return (
    <>
      <Toaster
         
        position="top-center"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/my-blogs"
            element={
              <ProtectedRoute>
                <Myblog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-blogs"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-blog/:id"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
