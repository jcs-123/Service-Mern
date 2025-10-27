import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const forms = Array.from({ length: 21 }, (_, i) => i + 1);

  return (
    <div
      className="bg-light border-end p-3"
      style={{ width: "220px", height: "100vh", overflowY: "auto" }}
    >
      <h6 className="fw-bold mb-3">Forms</h6>
      {forms.map((n) => (
        <Link
          key={n}
          to={`/form/${n}`}
          className={`d-block py-1 px-2 mb-1 rounded ${
            location.pathname === `/form/${n}`
              ? "bg-primary text-white"
              : "text-dark"
          }`}
        >
          Form {n}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
