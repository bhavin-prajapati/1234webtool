'use client';
import React from 'react';
import { useTimer, useTime } from 'react-timer-hook';

function Digit({ value, title }: { value: number; title: string }) {
  const digits = value.toString().padStart(4, '0');
  return (
    <div className="flex flex-col items-center mx-[5px]">
      <span className="text-xs mb-[5px] text-[#404549]">{title}</span>
      <div className="flex flex-row">
        <span className="relative flex text-[30px] bg-[#404549] rounded-[5px] py-[10px] px-[12px] text-white mr-[2px] after:absolute after:left-0 after:right-0 after:top-1/2 after:h-[2px] after:bg-[#232323] after:opacity-40">
          {digits[2]}
        </span>
        <span className="relative flex text-[30px] bg-[#404549] rounded-[5px] py-[10px] px-[12px] text-white after:absolute after:left-0 after:right-0 after:top-1/2 after:h-[2px] after:bg-[#232323] after:opacity-40">
          {digits[3]}
        </span>
      </div>
    </div>
  );
}

function SeparatorDots() {
  return (
    <span className="flex flex-col items-center self-end mb-[10px]">
      <span className="inline-block w-[6px] h-[6px] bg-[#404549] rounded-full my-[5px]" />
      <span className="inline-block w-[6px] h-[6px] bg-[#404549] rounded-full my-[5px]" />
    </span>
  );
}

const btnClass = "mr-[10px] last:mr-0 outline-none border border-[#404549] rounded-[3px] py-[6px] px-[14px] text-[#404549] bg-white hover:shadow-md hover:cursor-pointer";

function UseTimeSection() {
  const { seconds, minutes, hours } = useTime({});

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mt-5 mb-4">Clock</h2>
      <br />
      <div className="flex flex-row items-center mb-[30px]">
        <Digit value={hours} title="HOURS" />
        <SeparatorDots />
        <Digit value={minutes} title="MINUTES" />
        <SeparatorDots />
        <Digit value={seconds} title="SECONDS" />
      </div>
    </div>
  );
}

function UseTimerSection() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600); // 10 minutes

  const {
    seconds,
    minutes,
    hours,
    days,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp: time, onExpire: () => console.log('Timer expired!') });

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mt-5 mb-4">Timer</h2>
      <br />
      <div className="flex flex-row items-center mb-[30px]">
        <Digit value={days} title="DAYS" />
        <SeparatorDots />
        <Digit value={hours} title="HOURS" />
        <SeparatorDots />
        <Digit value={minutes} title="MINUTES" />
        <SeparatorDots />
        <Digit value={seconds} title="SECONDS" />
      </div>

      <div className="flex">
        <button onClick={start} className={btnClass}>Start</button>
        <button onClick={pause} className={btnClass}>Pause</button>
        <button onClick={resume} className={btnClass}>Resume</button>
        <button
          onClick={() => {
            const newTime = new Date();
            newTime.setSeconds(newTime.getSeconds() + 600);
            restart(newTime);
          }}
          className={btnClass}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

function TimerApp() {
  return (
    <div className="min-h-screen bg-white font-[Arial,sans-serif] text-[#404549] flex flex-col items-center justify-center gap-8">
      <UseTimeSection />
      <hr className="w-full max-w-md border-dashed border-[#404549] border-t-2" />
      <UseTimerSection />
    </div>
  );
}

export default TimerApp;
