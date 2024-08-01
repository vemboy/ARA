import { useEffect, useRef, useState } from "react";

const useResponsiveFontSize = (text) => {
  const [fontSize, setFontSize] = useState("16px");
  const containerRef = useRef(null);

  useEffect(() => {
    const adjustFontSize = () => {
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.offsetWidth;
        let newFontSize = parseInt(fontSize, 10);

        // Adjust font size while text is overflowing, with a smaller decrement step
        while (container.scrollWidth > containerWidth && newFontSize > 12) {
          newFontSize -= 0.5; // Smaller step for more granular adjustment
          setFontSize(`${newFontSize}px`);
        }
      }
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);

    return () => window.removeEventListener("resize", adjustFontSize);
  }, [text]);

  return { fontSize, containerRef };
};

export default useResponsiveFontSize;