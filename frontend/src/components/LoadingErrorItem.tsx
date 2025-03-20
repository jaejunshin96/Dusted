import React from "react";

interface LoadingErrorItemProps {
  message: string;
  isError?: boolean;
}

const LoadingErrorItem: React.FC<LoadingErrorItemProps> = ({ message, isError = false }) => {
  return (
    <li style={{
      padding: "8px",
      color: isError ? "red" : "gray",
      fontStyle: isError ? "normal" : "italic"
    }}>
      {message}
    </li>
  );
};

export default LoadingErrorItem;
