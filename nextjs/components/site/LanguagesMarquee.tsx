import Marquee from "@/components/site/Marquee";
import { languagesNames } from "@/lib/languages-legacy";

export function LanguagesMarquee() {
  const items = Object.values(languagesNames).map((language) => language.toUpperCase());
  return (
    <div className="relative flex w-full overflow-x-hidden text-white bg-transparent">
      <Marquee pauseOnHover className="[--duration:90s]">
        {items.map((item, i) => {
          return (
            <span key={i} className="mx-2 text-xl">
              {item}
            </span>
          );
        })}
      </Marquee>
    </div>
  );
}
