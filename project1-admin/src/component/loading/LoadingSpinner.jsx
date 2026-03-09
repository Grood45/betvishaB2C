import { Spinner } from '@chakra-ui/react';
import React from 'react';

const LoadingSpinner = ({ size, color, thickness }) => {
  // Override 'green' to gold (#D4AF37) for the new theme
  const spinnerColor = color === "green" || !color ? "#D4AF37" : color;

  return (
    <div className="spinner-container flex justify-center items-center py-4">
      <Spinner
        size={size || "xl"}
        color={spinnerColor}
        thickness={thickness || "4px"}
        speed="0.65s"
        emptyColor="gray.200"
      />
    </div>
  );
};

export default LoadingSpinner;
