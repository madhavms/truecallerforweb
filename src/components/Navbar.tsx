import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">WebCaller Lookup</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
