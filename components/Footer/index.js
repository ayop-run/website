import React from "react";
import Socials from "../Socials";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="mt-5 laptop:mt-40 p-2 laptop:p-0">
        <div>
          <h2 className="text-2xl tablet:text-3xl laptop:text-4xl font-bold mb-8">
            Contact
          </h2>
          <div className="mt-10">
            {/* <h2 className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl text-bold">
              LET&apos;S RUN
            </h2>
            <h2 className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl text-bold">
              TOGETHER
            </h2> */}
            {/* <Button type="primary">Schedule a call</Button> */}
            <div className="mt-10">
              <Socials />
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium mt-6 laptop:mt-10 p-2 laptop:p-0 opacity-70">
        Made With ❤ by{" "}
        <Link href="https://ayop.run" className="underline underline-offset-1">
          AYOP
        </Link>
      </p>
    </>
  );
};

export default Footer;
