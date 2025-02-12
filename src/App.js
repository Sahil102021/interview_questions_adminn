import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Category from "./Componet/page/Category";
import Dashboard from "./Componet/page/Dasboard"
import Login from "./Componet/users/Loginpage"
import Signuppage from "./Componet/users/Signuppage";
import toast, { Toaster } from 'react-hot-toast';
import Question from "./Componet/page/Question";
import Secure from "./Componet/Sacure";
import Banner from "./Componet/page/Banner";



function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signuppage />} />
          <Route path="/dashboard" element={<Secure><Dashboard /></Secure>} />
          <Route path="/category" element={<Secure><Category /></Secure>} />
          <Route path="/question" element={<Secure><Question /></Secure>} />
          <Route path="/banner" element={<Secure><Banner /></Secure>} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
