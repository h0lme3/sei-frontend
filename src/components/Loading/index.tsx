import React, { useEffect } from "react";

import { MoonLoader } from "react-spinners";

import { Row } from "components";
import { useMain } from "contexts";

const Loading = () => {
  const { isLoading } = useMain();

  useEffect(() => {
    document.documentElement.style.overflow = isLoading ? "hidden" : "auto";
  }, [isLoading]);

  return isLoading ? (
    <Row className="fixed z-[9999] left-0 top-0 w-full min-h-full justify-center bg-[#00000068]">
      <MoonLoader color="white" className="bg-black rounded-full" />
    </Row>
  ) : (
    <></>
  );
};

export default Loading;
