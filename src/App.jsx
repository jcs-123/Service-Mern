import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Generalsetting from "./pages/Generalsetting";
import Qualification from "./pages/Qualification";
import SubjectEngaged from "./pages/SubjectEngaged";
import Publications from "./pages/Publications";
import ProgramsCoordinated from "./pages/ProgramsCoordinated";
import ProgramsAttended from "./pages/ProgramsAttended";
import Experience from "./pages/Experience.jsx";


function App() {
  return (
    <>
      <Routes>
       <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />
                <Route element={<Layout />}>

        <Route path='/GeneralDetail' element={<Generalsetting />} />
        <Route path='/Qualification' element={<Qualification />} />
        <Route path="/SubjectEngaged" element={<SubjectEngaged />} />
        <Route path="/Publications" element={<Publications />} />
        <Route path="/ProgramsCoordinated" element={<ProgramsCoordinated />} />
        <Route path="/ProgramsAttended" element={<ProgramsAttended />} />

        <Route path='/Experience' element={<Experience/>} />

        </Route>

      </Routes>
    </>
  );
}

export default App;
