import {Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import Navbar from "./features/ui/components/Navbar";



export default function App() {
  return (
  <>
  

<Navbar/>
      <Routes>
        <Route path="/login" element={<Login/>} />
      
      </Routes>
    </>
  );
}