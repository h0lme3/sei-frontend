import React from "react";

import type { ComponentProps, FC } from "types";

// default container for SOLA-X
const Container: FC<ComponentProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`max-w-[1440px] w-full mx-auto px-[146px] desktop:px-[40px] laptop:px-[30px] mobile:px-[15px] last:px-[8px] ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
