import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const name = localStorage.getItem("name");
  const department = localStorage.getItem("department");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-primary px-3 d-flex justify-content-between">
      <h5 className="text-white mb-0">Service Book</h5>
      <div className="text-white">
        {name} ({department}) &nbsp;
        <button className="btn btn-light btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
