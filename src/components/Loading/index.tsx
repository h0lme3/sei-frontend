import React from "react";

import { MoonLoader } from "react-spinners";

import { Row } from "components";
import { useMain } from "contexts";

const Loading = () => {
  const { isLoading } = useMain();

  return isLoading ? (
    <Row className="absolute z-[9999] left-0 top-0 w-full h-full justify-center bg-[#00000068]">
      <MoonLoader color="white" className="bg-black rounded-full" />
    </Row>
  ) : (
    <></>
  );
};

export default Loading;
