"use client";

import Link from "next/link";
import confetti from "canvas-confetti";

export default function Surprise() {
  const handle1 = () => {
    const scalar = 2;
    const triangle = confetti.shapeFromPath({
      path: "M0 10 L5 0 L10 10z",
    });
    const square = confetti.shapeFromPath({
      path: "M0 0 L10 0 L10 10 L0 10 Z",
    });
    const coin = confetti.shapeFromPath({
      path: "M5 0 A5 5 0 1 0 5 10 A5 5 0 1 0 5 0 Z",
    });
    const tree = confetti.shapeFromPath({
      path: "M5 0 L10 10 L0 10 Z",
    });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [triangle, square, coin, tree],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  const handle2 = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handle3 = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };
  const handle4 = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  const handle5 = () => {
    const scalar = 2;
    const unicorn = confetti.shapeFromText({ text: "🦄", scalar });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [unicorn],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  const handle6 = () => {
    confetti({ angle: Math.random() * 360 });
  };

  const handleClick = () => {
    const r = Math.floor(Math.random() * 6);
    switch (r) {
      case 0:
        handle1();
        break;
      case 1:
        handle2();
        break;
      case 2:
        handle3();
        break;
      case 3:
        handle4();
        break;
      case 4:
        handle5();
        break;
      case 5:
        handle6();
        break;
    }
  };

  return (
    <Link className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0" onClick={handleClick} href="#">
      Surprise!
    </Link>
  );
}
