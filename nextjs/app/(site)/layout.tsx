import { PropsWithChildren } from "react";
import Nav from "../../components/site/Nav";
import Footer from "../../components/site/Footer";

export default function LongLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
