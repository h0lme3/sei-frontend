import type { FC, PropsWithChildren } from "react";
import React from "react";

import type { ExtraTWClassProps } from "types";

const Col: FC<PropsWithChildren & ExtraTWClassProps> = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-4 ${className}`}>{children}</div>;
};

export default Col;
