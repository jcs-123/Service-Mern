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
import SeminarsGuided from "./pages/SeminarsGuided.jsx";
import InteractionsOutsideWorld from "./pages/InteractionsOutsideWorld.jsx";
import PositionsHeld from "./pages/PositionsHeld.jsx";
import ResearchInterests from "./pages/ResearchInterests.jsx";
import Achievements from "./pages/Achievements.jsx";
import InterestedSubjects from "./pages/InterestedSubjects.jsx";
import ActivityLog from "./pages/ActivityLog.jsx";
import Patent from "./pages/Patent.jsx";
import MoocCourseCompleted from "./pages/MoocCourseCompleted.jsx";
import AdministrativeWork from "./pages/AdministrativeWork.jsx";
import ProfessionalBodyMembership from "./pages/ProfessionalBodyMembership.jsx";
import FacultyResearch from "./pages/FacultyResearch.jsx";
import Consultancy from "./pages/Consultancy.jsx";
import Projectguided from "./pages/Projectguided.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";


function App() {
  return (
    <>
      <Routes>
       <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />
                <Route path="/forgotpassword" element={<ForgotPassword/>}/>

                <Route element={<Layout />}>

        <Route path='/GeneralDetail' element={<Generalsetting />} />
        <Route path='/Qualification' element={<Qualification />} />
        <Route path="/SubjectEngaged" element={<SubjectEngaged />} />
        <Route path="/Publications" element={<Publications />} />
        <Route path="/ProgramsCoordinated" element={<ProgramsCoordinated />} />
        <Route path="/ProgramsAttended" element={<ProgramsAttended />} />
        <Route path='/Experience' element={<Experience/>} />
        <Route path="/SeminarsGuided" element={<SeminarsGuided />} /> 
        <Route path="/InteractionsOutsideWorld" element={<InteractionsOutsideWorld />} />
        <Route path="/PositionsHeld" element={<PositionsHeld />} />
        <Route path="/ResearchInterests" element={<ResearchInterests />} />
        <Route path="/Achievements" element={<Achievements />} />
        <Route path="/InterestedSubjects" element={<InterestedSubjects />} />
        <Route path="/ActivityLog" element={<ActivityLog />} />
        <Route path="/Patent" element={<Patent />} />
        <Route path="/MoocCourseCompleted" element={<MoocCourseCompleted />} />
        <Route path="/AdministrativeWork" element={<AdministrativeWork />} />
        <Route path="/Professional" element={<ProfessionalBodyMembership />}
/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>







        <Route path='/FacultyReserach' element={<FacultyResearch/>} />
        <Route path='/Consultancy' element={<Consultancy/>} />
        <Route path='/ProjectGuided' element={<Projectguided/>} />

        </Route>

      </Routes>
    </>
  );
}

export default App;
