import { useRef, useState } from "react";
import "./App.css";
import Three360Viewer from "./components/Three360Viewer";

function App() {
  const images = [
    {
      url: "street.webp",
      name: "Street",
    },
    {
      url: "mc-env.webp",
      name: "Minecraft",
    },
    {
      url: "dust-2.webp",
      name: "Dust 2",
    },
  ];
  const [currentView, setCurrentView] = useState(images[0]);

  const containerRef = useRef(null);
  const viewRefs = useRef([]);

  const scrollToView = (index) => {
    if (viewRefs.current[index] && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const viewWidth = viewRefs.current[index].offsetWidth;
      const scrollPosition =
        viewRefs.current[index].offsetLeft - containerWidth / 2 + viewWidth / 2;

      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleViewClick = (view, index) => {
    setCurrentView(view);
    scrollToView(index);
  };
  return (
    <div className="w-full relative">
      <Three360Viewer imageUrl={currentView?.url} />
      <div
        ref={containerRef}
        className="w-full flex items-center gap-4 overflow-x-auto absolute bottom-0 left-0 p-10"
      >
        {images.map((item, index) => (
          <button
            key={item}
            ref={(el) => (viewRefs.current[index] = el)}
            onClick={() => handleViewClick(item, index)}
            className={`${
              currentView?.id === item.id ? "bg-black" : "bg-[#222]"
            } px-4 py-2 flex-shrink-0 rounded text-white shadow-sm shadow-white`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
