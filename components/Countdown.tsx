
import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const Item = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center p-4 min-w-[80px]">
      <span className="text-3xl md:text-5xl font-serif text-earth">{val.toString().padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-widest text-gold mt-1 font-sans font-bold">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center space-x-2 md:space-x-8 bg-white/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-cream">
      <Item val={timeLeft.days} label="Күн" />
      <Item val={timeLeft.hours} label="Сағат" />
      <Item val={timeLeft.minutes} label="Минут" />
      <Item val={timeLeft.seconds} label="Секунд" />
    </div>
  );
};

export default Countdown;
