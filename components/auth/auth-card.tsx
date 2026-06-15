import React from "react";

type CardWrapperProps = {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocials?: boolean;
};

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Socials from "./socials";
import BackButton from "./backButton";

export default function AuthCard({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: CardWrapperProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className=" text-xl">{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>

        {showSocials && (
          <CardFooter>
            <Socials />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton href={backButtonHref} label={backButtonLabel} />
        </CardFooter>
      </Card>
    </>
  );
}
