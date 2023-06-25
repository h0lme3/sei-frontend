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
    <Row className="fixed z-max left-0 top-0 w-full min-h-full justify-center backdrop-blur-md backdrop-brightness-50">
      <MoonLoader color="white" className="rounded-full" />
    </Row>
  ) : (
    <></>
  );
};

export default Loading;
