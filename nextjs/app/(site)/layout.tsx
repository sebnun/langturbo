import { PropsWithChildren } from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

export default function LongLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
