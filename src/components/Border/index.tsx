import React, { type FC } from "react";

interface BorderProps {
  vertical?: boolean;
}

import type { ExtraTWClassProps } from "types";

// horizontal or vertical border based on vertical boolean props.
// i.e. if vertical is true, apply vertical border style. otherwise, apply horizontal border style.
// need to pass style like border color and more detail style as props via className of ExtraTWClassProps
const Border: FC<BorderProps & ExtraTWClassProps> = ({ vertical = false, className = "" }) => {
  return <div className={`${vertical ? "w-px" : "border"} ${className}`} />;
};

export default Border;
