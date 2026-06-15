"use server";
import React from "react";
import { auth } from "@/server/auth";
import UserButton from "./user-button";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";
import ThemeToggle from "./theme-container";
import Logo from "./logo";



export default async function nav() {
  const session = await auth();

  return (
    <header className="py-12">
      <nav>
        <ul className="flex justify-between items-center gap-1 sm:gap-2 md:gap-6">
          <li className="flex flex-1 ">
           <Logo/>
          </li>
          <li>
            <ThemeToggle/>
          </li>
          <li className="flex items-center hover:text-primary p-2 rounded-md transition-all ease-in-out duration-300 ">
            <CartDrawer />
          </li>
         
          {!session ? (
            <li>

                <Link href="/auth/login">
                <LogInIcon />
                </Link>
            </li>
          ) : (
            <li>
              <UserButton
                user={session?.user}
                expires={session?.expires || ""}
              />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
