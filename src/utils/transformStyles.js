// src/utils/transformStyles.js
export const getTransformStyle = (anchor, expanded) => {
    switch (anchor) {
      case "left":
        return expanded ? "translateX(0)" : "translateX(-100%)";
      case "right":
        return expanded ? "translateX(0)" : "translateX(100%)";
      case "top":
        return expanded ? "translateY(0)" : "translateY(-100%)";
      case "bottom":
        return expanded ? "translateY(0)" : "translateY(100%)";
      default:
        return "";
    }
  };