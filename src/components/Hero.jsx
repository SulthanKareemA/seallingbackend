import React from "react";

import Typed from "react-typed";

const Hero = () => {
  return (
    <div className="text-white">
      <div className="max-w-[1000px] w-full h-screen max-h-[500px] mx-auto text-center flex flex-col justify-center">
        <div className="flex justify-center item-center">
          <h1 className=" bg-gradient-to-r from-blue-900 to-sky-500 text-white px-2 text-7xl object-mid font-black">
            Sea Level Monitoring.
          </h1>
        </div>

        <div className="flex justify-center items-center mt-10">
          <p className="md:text-5xl sm:text-4xl text-xl font-normal italic py-4">
            Monitoring air laut secara
          </p>
          <Typed
            className="underline decoration-sky-500 md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2"
            strings={["REAL TIME", "AKURAT", "EFISIEN"]}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <div className="flex justify-center mt-2 items-center md:text-xl text-xl font-medium text-gray-500 mb-2">
          <p className=" md:text-xl text-xl font-medium text-gray-500 ">
            Deteksi awal, aksi cepat: bersama melindungi ekosistem laut dari
            ancaman.
          </p>
        </div>

        <a href="#/monitoring-now">
          <button className="ease-in-out delay-150 justify-center hover:scale-105 transition-all duration-500 bg-white hover:bg-slate-100 w-[250px] rounded-full font-medium my-6 mx-auto p-3 text-slate-900">
            Monitoring Now!
          </button>
        </a>
      </div>
    </div>
  );
};

export default Hero;
