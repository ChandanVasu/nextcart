"use client";
import { Button } from "@heroui/react";

const CustomButton = ({ children, ...props }) => {
  // Read and convert the environment variable
  const isDisabled = process.env.NEXT_PUBLIC_IS_DEV === "true";

  return (
    <Button
      isDisabled={isDisabled}
      color="primary"
      size="md"
      variant="solid"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
