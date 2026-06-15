"use client";
import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Socials() {
  return (
    <div className="flex flex-col items-center w-full gap-4 ">
      <Button
        className="flex w-full "
        variant={"secondary"}
        onClick={() => signIn("google",{
          redirect:false,
          callbackUrl: '/'
        })}
      >
        <p className="pr-1"> Sign in with Google</p>
        <FcGoogle style={{ width: '18px', height: '18px' }}  />
      </Button>
      <Button
        className="flex w-full "
        variant={"secondary"}
        onClick={() => signIn("github", {
           redirect:false,
          callbackUrl: '/'
        })}
      >
        <p className="pr-1"> Sign in with Google</p>
        <FaGithub style={{ width: '18px', height: '20px' }}  />
      </Button>
    </div>
  );
}
