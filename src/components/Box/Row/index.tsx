import React from "react";

import type { ButtonProps, ComponentProps, FC } from "types";

const Row: FC<ComponentProps & Pick<ButtonProps, "action">> = ({ children, className = "", action }) => {
  return (
    <div onClick={action} className={`flex items-center space-x-4 ${className}`}>
      {children}
    </div>
  );
};

export default Row;
