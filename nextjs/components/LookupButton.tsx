"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function LookupButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} size="lg" className="font-bold" type="submit">
      Lookup Pronunciation Examples
    </Button>
  );
}
