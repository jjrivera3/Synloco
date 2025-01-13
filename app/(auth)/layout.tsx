import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return <div className="flex justify-center pt-20">{children}</div>;
};

export default layout;
