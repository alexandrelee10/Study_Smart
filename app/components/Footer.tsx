import React from "react";
import logo from "@/public/assets/logo/logo.svg";
import Image from "next/image";
const FooterPage = () => {
  return (
    <section className="">
      <div className="bg-black">
        <div className="max-w-6xl mx-auto h-20 px-4">
          {/* Right */}
          <div>
            {/* Logo */}
            <div className=" relative h-24 w-60">
              <Image 
              src={logo} 
              alt="logo"
              fill
              className="object-contain" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterPage;
