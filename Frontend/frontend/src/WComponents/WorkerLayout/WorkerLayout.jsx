import React from "react";
import WSidebar from "../WSidebar/WSidebar";
import "./workerLayout.css";

const WorkerLayout = ({ children }) => {
  return (
    <div className="worker-container">
      <WSidebar />
      <div className="worker-content">
        {children}
      </div>
    </div>
  );
};

export default WorkerLayout;
