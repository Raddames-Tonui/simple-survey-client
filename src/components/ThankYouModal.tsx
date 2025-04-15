import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const messages = [
  "Cheers to you!",
  "You are the Best.",
  "You're awesome – survey completed!",
  "This is super helpful!",
  "We really appreciate your input!",
  "Thanks for sharing your thoughts with us!",
  "Your feedback helps us grow!",
  "High five! 🎉 Your response was received.",
  "Yaay! You made our day!",
  "Your submission really means a lot to us.",
];

type ThankYouModalProps = {
  onClose: () => void;
};

const ThankYouModal = ({ onClose }: ThankYouModalProps) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white  h-[90vh] md:h-[70vh] shadow-xl p-6 md:max-w-[60vw] w-full flex flex-col justify-center items-center text-center relative">
        <h1 className="text-3xl font-bold text-[#0190B0] mb-2">Thank you!</h1>
        <p className="text-lg text-gray-700 mb-6">{message}</p>
        <h2 className="font-semibold text-lg mb-2"> Want to create your own?</h2>
        <Link
          to="/auth/signup"
          className="flex gap-2 text-gray-700 hover:text-white border border-[#00A5CB] hover:bg-[#0190B0] py-2 px-6 rounded font-bold"
        >
          Try JazaForm
          <img src="/survey-icon.webp" className="h-7 w-7" alt="" />
        </Link>
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;
