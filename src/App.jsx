import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Generalsetting from "./pages/Generalsetting";
import Qualification from "./pages/Qualification";


function App() {
  return (
    <>
      <Routes>
       <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />
                <Route element={<Layout />}>

        <Route path='/GeneralDetail' element={<Generalsetting />} />
        <Route path='/Qualification' element={<Qualification />} />


        </Route>

      </Routes>
    </>
  );
}

export default App;
