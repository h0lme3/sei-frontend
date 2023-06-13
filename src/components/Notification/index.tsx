import React from "react";

import { toast } from "react-toastify";

import type { NotificationProps } from "types";

// notification component
const Notification = ({ type = "", title = "", message = "", link = "" }: NotificationProps) => {
  const messageWithOrWithoutLink = link ? (
    // with link
    <a href={link} target="_blank" rel="noopener noreferrer" className="inline text-[12px]">
      <span className="space-x-2">
        {message}
        <b className="ml-2">Show transaction</b>
      </span>
    </a>
  ) : (
    // without link
    <div className="inline text-[12px]">{message}</div>
  );

  const container = (
    <div className="px-2 space-y-1">
      <div className="text-[18px]">{title}</div>
      <div className="text-[16px]">{messageWithOrWithoutLink}</div>
    </div>
  );

  switch (type) {
    case "success":
      return toast.success(container);
    case "warn":
      return toast.warn(container);
    case "error":
      return toast.error(container);
    default:
      return toast(container);
  }
};

export default Notification;
