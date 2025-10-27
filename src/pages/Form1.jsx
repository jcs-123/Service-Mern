import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Form1 = () => {
  const [data, setData] = useState({ qualification: "", year: "" });
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("form1", JSON.stringify(data));
    navigate("/form/2");
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container py-4">
          <h4>Form 1: Basic Details</h4>
          <input
            className="form-control mb-3"
            placeholder="Qualification"
            value={data.qualification}
            onChange={(e) =>
              setData({ ...data, qualification: e.target.value })
            }
          />
          <input
            className="form-control mb-3"
            placeholder="Year"
            value={data.year}
            onChange={(e) => setData({ ...data, year: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form1;
