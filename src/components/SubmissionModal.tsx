import SubmitLoader from "./SubmitLoader";

const SubmissionModal = (): React.JSX.Element => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white  h-[60vh] shadow-xl p-6 md:max-w-[60vw] w-full flex flex-col justify-center items-center text-center relative">
        <div className=" ">
          <SubmitLoader />
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
