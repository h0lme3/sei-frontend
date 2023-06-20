import React, { type FC } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button, Col } from "components";
import type { SeoProps } from "types";

// page for 404 or 500 error pages
const Template: FC<Pick<SeoProps, "title">> = ({ title = "" }) => {
  const router = useRouter();

  return (
    <Col className="flex-1 justify-center">
      <Col className="h-full items-center space-y-8">
        <div className="tablet:w-[204px] mobile:w-[128px]">
          <Image src="/preview/default.png" alt="Logo for Sola-X" width={256} height={256} priority />
        </div>
        <div className="text-center font-bold text-[72px] laptop:text-[56px] tablet:text-[36px] mobile:text-[24px]">
          {title}
        </div>
        <Button action={() => router.push("/")}>Back to Home</Button>
      </Col>
    </Col>
  );
};

export default Template;
