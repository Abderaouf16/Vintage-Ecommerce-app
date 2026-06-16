"use server";
import React from "react";
import { FaInstagram, FaTiktok, FaPhone } from "react-icons/fa6";


export default async function footer() {

  return (
    <footer className="w-full border-t  mt-10">
      <div className="mx-auto max-w-6xl  py-6 md:px-10 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 ">

        {/* Brand / text */}
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Vintage Supply DZ. All rights reserved.
        </p>

        {/* Contact links */}
        <div className="  flex items-center justify-center gap-6 text-sm   ">

          {/* Phone */}
          <a
            href="tel:0558768495"
            className="flex items-center gap-2 hover:text-primary transition"
          >
            <FaPhone />
            <span>+213 0558768495</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/vintage.supply.dz/"
            target="_blank"
            className="flex items-center gap-2 hover:text-primary transition"
          >
            <FaInstagram />
            <span>vintage.supply.dz</span>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@vintage.supply.dz"
            target="_blank"
            className="flex items-center gap-2 hover:text-primary transition"
          >
            <FaTiktok />
            <span>vintage.supply.dz</span>
          </a>

        </div>
      </div>
    </footer>
  );
}
