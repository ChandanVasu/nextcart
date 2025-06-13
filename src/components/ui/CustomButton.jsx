import { Button } from "@heroui/react";

const CustomButton = ({ children, ...props }) => {
  return (
    <Button color="primary" size="md" variant="solid" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
