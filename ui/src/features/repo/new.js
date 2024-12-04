import React from "react";

function NewChanges() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full flex items-center flex-col min-h-screen">
     

      <textarea
        placeholder="Write your prompt here..."
        className="w-[80%] h-40 p-4 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none mb-4"
      ></textarea>

      <div className="flex items-center space-x-[400px] mb-6">
        <button
          className="ml-[600px] px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transform hover:scale-105 transition"
        >
          Apply Changes
        </button>

        <button
          className=" px-3 py-2 bg-green-500 text-white font-medium rounded shadow-md hover:bg-green-600 transform hover:scale-105 transition"
        >
          Commit
        </button>
      </div>

      <form
        className="w-[80%] h-[600px] border border-dashed border-gray-400 rounded-md flex items-center justify-center"
      >
        <div className="text-gray-400"></div>
      </form>
    </div>
  );
}

export default NewChanges;
