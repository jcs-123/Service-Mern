import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Form2 = () => {
  const [data, setData] = useState({ experience: "", designation: "" });
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("form2", JSON.stringify(data));
    navigate("/form/3"); // later create Form3
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container py-4">
          <h4>Form 2: Experience Details</h4>
          <input
            className="form-control mb-3"
            placeholder="Experience (Years)"
            value={data.experience}
            onChange={(e) =>
              setData({ ...data, experience: e.target.value })
            }
          />
          <input
            className="form-control mb-3"
            placeholder="Designation"
            value={data.designation}
            onChange={(e) =>
              setData({ ...data, designation: e.target.value })
            }
          />
          <button className="btn btn-success" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form2;
