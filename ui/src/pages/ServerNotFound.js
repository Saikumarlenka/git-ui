import React from 'react';

function ServerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-500">500</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">Server Not Found</h2>
      <p className="text-gray-500 mt-2">Oops! Something went wrong. We’re unable to connect to the server.</p>
      <a
        href="/"
        className="mt-6 px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow"
      >
        Go Back to Home
      </a>
    </div>
  );
}

export default ServerNotFound;
