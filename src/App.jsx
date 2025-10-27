import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Generalsetting from "./pages/Generalsetting";


function App() {
  return (
    <>
      <Routes>
       <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />
                <Route element={<Layout />}>

        <Route path='/GeneralDetail' element={<Generalsetting />} />


        </Route>

      </Routes>
    </>
  );
}

export default App;
