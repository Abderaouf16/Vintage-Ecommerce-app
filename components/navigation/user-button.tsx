"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { LogOut, Settings, TruckIcon } from "lucide-react";
import { useRouter } from "next/navigation";


export default function UserButton({ user }: Session) {
  const router = useRouter();

  // Set the initial switch state based on the theme
 

  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar>
            {user?.image && (
              <Image src={user.image} alt={user.name!} width={40} height={35} />
            )}
            {!user?.image && (
              <AvatarFallback className=" bg-primary/25">
                <div className=" font-bold">
                  {user?.name?.charAt(0).toLocaleUpperCase()}
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-6" align="end">
          <div className=" mb-4 p-4 flex flex-col gap-1 items-center rounded-lg  bg-primary/10">
            <Avatar>
              {user?.image && (
                <Image
                  className=" rounded-full"
                  src={user.image}
                  alt={user.name!}
                  width={40}
                  height={40}
                />
              )}
            </Avatar>
            <p className=" font-bold text-xs mt-2">{user?.name}</p>
            <span className=" text-xs  font-normal  text-secondary-foreground">
              {user?.email}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/orders")}
            className="group py-2 font-normal cursor-pointer"
          >
            <TruckIcon
              size={14}
              className="mr-3 group-hover:translate-x-1 transition-all ease-in-out duration-500 "
            />
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="group py-3  font-normal cursor-pointer"
          >
            <Settings
              size={14}
              className="mr-3 group-hover:rotate-90 transition-all ease-in-out duration-500 "
            />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              signOut();
            }}
            className="py-2 group focus:bg-destructive/15 font-medium cursor-pointer"
          >
            <LogOut
              size={14}
              className="mr-3  group-hover:scale-75 transition-all duration-300 ease-in-out "
            />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
