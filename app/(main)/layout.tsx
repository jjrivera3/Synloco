import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return <div className="container mx-auto mt-5">{children}</div>;
};

export default Layout;
