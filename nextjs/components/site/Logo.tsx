import Image from "next/image";
import LogoImage from "../../public/images/logo.svg";


export default function LogoTextSpan() {
  return (
    <span
      className="text-white text-4xl font-handjet hidden sm:inline-block"
    >
      LangTurbo
    </span>
  );
}

export function LogoIcon() {
  return <Image src={LogoImage} className="h-12 w-12" alt="LangTurbo Logo" />;
}
