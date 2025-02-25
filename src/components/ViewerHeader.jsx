import React from "react";

const ViewerHeader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-300 shadow-sm flex items-center justify-between p-2 z-50">
      <img src="/3d-showcase-logo.svg" alt="3D Showcase Logo" className="h-10" />
      <img src="/bot-button.png" alt="Bot Button" className="h-10 cursor-pointer" />
    </div>
  );
};

export default ViewerHeader;