"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    }
    if (!tag) {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center gap-4 justify-center mb-8 flex-wrap">
      <div className=" mr-16">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer bg-gray-700 hover:bg-gray-600 py-2 px-4  hover:opacity-100 transition-all ease-in-out",
          !tag ? "opacity-100 border-black border-[3px]" : "opacity-40"
        )}
      >
        Tout
      </Badge>
      </div>
      <Badge
        onClick={() => setFilter("notebook")}
        className={cn(
          "cursor-pointer bg-amber-700 hover:bg-amber-800 py-2 px-4  hover:opacity-100 transition-all ease-in-out",
          tag === "notebook" && tag ? "opacity-100 border-gray-800 border-[2px]" : "opacity-40"
        )}
      >
        T-Shirt
      </Badge>
      <Badge
        onClick={() => setFilter("pen")}
        className={cn(
          "cursor-pointer bg-teal-700 hover:bg-teal-800 py-2 px-4  hover:opacity-100 transition-all ease-in-out",
          tag === "pen" && tag ? "opacity-100 border-gray-800 border-[2px]" : "opacity-40"
        )}
      >
        Short
      </Badge>
      <Badge
        onClick={() => setFilter("green")}
        className={cn(
          "cursor-pointer bg-green-500 hover:bg-green-600  py-2 px-4  hover:opacity-100 transition-all ease-in-out",
          tag === "green" && tag ? "opacity-100 border-gray-800 border-[2px]" : "opacity-40"
        )}
      >
        Casquette
      </Badge>
      <Badge
        onClick={() => setFilter("red")}
        className={cn(
          "cursor-pointer bg-red-500 hover:bg-red-600 py-2 px-4  hover:opacity-100 transition-all ease-in-out",
          tag === "red" && tag ? "opacity-100 border-gray-800 border-[2px]" : "opacity-40"
        )}
      >
        Pontalon
      </Badge>
      <Badge
        onClick={() => setFilter("blue")}
        className={cn(
          "cursor-pointer bg-blue-500 hover:bg-blue-600 py-2 px-4  hover:opacity-100 transition-all ease-in-out",
          tag === "blue" && tag ? "opacity-100 border-gray-800 border-[2px]" : "opacity-40"
        )}
      >
        Vest
      </Badge>
      <Badge
        onClick={() => setFilter("purple")}
        className={cn(
          "cursor-pointer bg-purple-500 hover:bg-purple-red-600 py-2 px-4  hover:opacity-100 transition-all ease-in-out",
          tag === "purple" && tag ? "opacity-100 border-gray-800 border-[2px]" : "opacity-40"
        )}
      >
        Sweet
      </Badge>
    </div>
  );
}
