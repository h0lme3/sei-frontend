import React from "react";

import type { ComponentProps, FC } from "types";

const Col: FC<ComponentProps> = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-4 ${className}`}>{children}</div>;
};

export default Col;
