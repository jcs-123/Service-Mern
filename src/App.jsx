import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Form1 from "./pages/Form1";
import Form2 from "./pages/Form2"; // add more later

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form/1" element={<Form1 />} />
        <Route path="/form/2" element={<Form2 />} />
      </Routes>
    </>
  );
}

export default App;
