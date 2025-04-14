import React from "react";
import Loader from "./Loader";

const SubmissionModal = (): JSX.Element => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white  h-[60vh] shadow-xl p-6 md:max-w-[60vw] w-full flex flex-col justify-center items-center text-center relative">
        <div className="flex flex-col items-center space-y-4 ">
          <div className="mb-10">
            <Loader />
          </div>
          <p className="text-gray-700 text-lg font-medium">
            Submitting your response...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
