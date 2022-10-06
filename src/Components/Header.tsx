import React from "react";

export default function Header() {
  return (
    <div className="flex justify-self-start ml-14 self-center mt-20 items-center m-10">
      <img
        src="./thermometer.svg"
        alt="Thermometer"
        width={50}
        className=""
      />
      <h1 className="text-white font-bold text-3xl">
        The Council
        <br />
        Temperature Control
      </h1>
    </div>
  );
}
