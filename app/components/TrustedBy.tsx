import React from "react";
import Link from "next/link";
import Image from "next/image";

import fiu from "../../public/assets/logo/school/fiu.svg";
import harvard from "../../public/assets/logo/school/harvard.svg";
import mit from "../../public/assets/logo/school/mit.png";

const TrustedByPage = () => {
  const schools = [
    {
      name: "Florida International University",
      image: fiu,
    },
    {
      name: "MIT",
      image: mit,
    },
    {
      name: "harvard",
      image: harvard,
    },
  ];

  return (
    <section className="flex justify-center py-12">
      <div className=" bg-white px-8 py-6 rounded-full text-center">
        <h2 className="text-sm sm:text-base font-medium text-zinc-700">
          Trusted by{" "}
          <span className="font-semibold text-zinc-900">
            10,000+ students
          </span>{" "}
          at top universities
        </h2>

        <div className="mt-4 flex items-center justify-center gap-6">
          {schools.map((s) => (
            <Link
              key={s.name}
              href="#"
              title={s.name}
              className="opacity-70 hover:opacity-100 transition"
            >
              <Image
                src={s.image}
                alt={s.name}
                height={32}
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedByPage;
