import React from "react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

function Signin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-800 via-gray-700 to-orange-900">
      <div className="text-center space-y-6">
       
        <Link to={'/'} 
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-green-700 text-white font-medium text-lg rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <FaGithub className="text-2xl" />
          <span>Connnect Your GitHub</span>
        </Link>
      </div>
    </div>
  );
}

export default Signin;
