import { useEffect, useState } from "react";

export default function SaleCountdownBanner() {
  const endDate = new Date("2026-12-31T23:59:59").getTime();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date().getTime();
    const distance = endDate - now;

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative grid md:grid-cols-2 w-full overflow-hidden z-10">

      {/* LEFT IMAGE */}
      <div className="h-[260px] md:h-[460px] ">
        <img
          src="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/black-5-desktop.jpg"
          alt="Black Friday"
          className="w-full h-full object-cover"
          style={{ objectPosition: "50% 0%" }}
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="bg-[#141931] text-white flex items-center justify-center text-center px-6 pt-10 md:py-0 ">
        <div className="max-w-md">

          <h2 className="text-4xl md:text-6xl font-light mb-4">
            BLACK FRIDAY
          </h2>

          <p className="opacity-80 mb-10">
            Shop your favorites before they’re gone
          </p>

          {/* ⏳ COUNTDOWN */}
          <div className="flex items-start justify-center">

            <TimeBox value={timeLeft.days} label="days" />
            <Colon />

            <TimeBox value={timeLeft.hours} label="hours" />
            <Colon />

            <TimeBox value={timeLeft.minutes} label="min" />
            <Colon />

            <TimeBox value={timeLeft.seconds} label="sec" />

          </div>

        </div>
      </div>
    </section>
  );
}


// 🔢 Timer Box
function TimeBox({ value, label }) {
  return (
    <div className="px-2 md:px-3 text-center">
      <div className="text-2xl md:text-3xl font-semibold leading-none">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs opacity-70 uppercase mt-1">
        {label}
      </div>
    </div>
  );
}


// : Colon aligned with numbers ONLY
function Colon() {
  return (
    <div className="px-1 md:px-2 text-2xl md:text-3xl font-light opacity-70 mt-[2px] md:mt-[3px]">
      :
    </div>
  );
}
