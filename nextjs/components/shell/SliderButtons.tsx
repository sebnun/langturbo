"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useCallback } from "react";

const SliderButtons = ({ targetId }: { targetId: string }) => {
  const scroll = useCallback(
    (direction: "left" | "right") => {
      const el = document.getElementById(targetId);
      if (!el) return;

      el.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    },
    [targetId, 200]
  );
  return (
    <>
      <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll("left")}>
        <ArrowLeftIcon />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll("right")}>
        <ArrowRightIcon />
      </Button>
    </>
  );
};

export default SliderButtons;
