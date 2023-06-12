import type { FC, PropsWithChildren } from "react";
import React from "react";

import { ClipLoader } from "react-spinners";

import type { ButtonProps, ExtraTWClassProps } from "utils/types";

const Button: FC<PropsWithChildren & ButtonProps & ExtraTWClassProps> = ({
  children,
  action,
  disabled,
  isLoading,
  type = "button",
  className,
}) => {
  return (
    <button
      id="button"
      type={type}
      disabled={disabled}
      onClick={action}
      className={`${
        isLoading || (disabled && "opacity-70 cursor-not-allowed")
      } h-[54px] px-[30px] rounded-full bg-primary_gradient uppercase font-bold text-[16px] text-white ${className}`}
    >
      {isLoading ? <ClipLoader color="white" size={30} /> : children}
    </button>
  );
};

export default Button;
