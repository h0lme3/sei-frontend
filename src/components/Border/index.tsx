import React from "react";

import type { ComponentProps, FC } from "types";

interface BorderProps {
  vertical?: boolean;
}

// horizontal or vertical border based on vertical boolean props.
// i.e. if vertical is true, apply vertical border style. otherwise, apply horizontal border style.
// need to pass style like border color and more detail style as props via className of ExtraTWClassProps
const Border: FC<BorderProps & ComponentProps> = ({ vertical = false, className = "" }) => {
  return <div className={`${vertical ? "w-px" : "border"} ${className}`} />;
};

export default Border;
