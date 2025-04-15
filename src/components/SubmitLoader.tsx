import React from 'react';
import './SubmitLoader.css'; // make sure this path matches your file location

const SubmitLoader = () => {
  return (
    <div className="submitloader">
      <span className="submitloader-text whitespace-nowrap  font-bold text-md">Submitting Survey</span>
      <span className="submitload"></span>
    </div>
  );
};

export default SubmitLoader;
