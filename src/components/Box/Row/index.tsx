import type { FC, PropsWithChildren } from "react";
import React from "react";

import type { ButtonProps, ExtraTWClassProps } from "utils/types";

const Row: FC<PropsWithChildren & ExtraTWClassProps & Pick<ButtonProps, "action">> = ({
  children,
  className,
  action = () => {},
}) => {
  return (
    <div onClick={action} className={`flex items-center space-x-4 ${className}`}>
      {children}
    </div>
  );
};

export default Row;
