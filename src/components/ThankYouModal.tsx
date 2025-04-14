import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const messages = [
  "Your response has been submitted.",
  "Thanks a bunch! We’ve got your answers.",
  "You're awesome – survey completed!",
  "That was super helpful, thank you!",
  "We appreciate your input!",
  "Thanks for sharing your thoughts with us!",
  "Your feedback helps us grow!",
  "High five! 🎉 Your response was received.",
  "Thanks, you made our day!",
  "Submission successful – you rock!"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center relative">
        <h1 className="text-3xl font-bold text-[#0190B0] mb-2">Thank you!</h1>
        <p className="text-lg text-gray-700 mb-4">{message}</p>
        <Link
          to="/auth/signup"
          className="inline-block text-white bg-[#00A5CB] hover:bg-[#0190B0] py-2 px-6 rounded font-semibold"
        >
          Want to create your own?
        </Link>
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;
