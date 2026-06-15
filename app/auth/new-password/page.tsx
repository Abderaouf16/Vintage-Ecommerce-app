import NewPasswordForm from "@/components/auth/new-password-form";
import { Suspense } from "react";

export default function Reset() {
  return (
    <div>
      <Suspense>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
}
