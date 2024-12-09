import { useLayoutEffect, useState } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export const useDimensions = (ref: React.RefObject<HTMLElement>): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Add event listener for window resize
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return dimensions;
};
