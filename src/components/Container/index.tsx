import React from "react";

import type { ComponentProps, FC } from "types";

// default container for SOLA-X
const Container: FC<ComponentProps> = ({ children, className = "" }) => {
  return (
    <div className={`max-w-[1440px] w-full mx-auto px-36 desktop:px-10 laptop:px-8 mobile:px-4 last:px-2 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
