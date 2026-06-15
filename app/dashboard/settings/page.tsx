import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SettingsCard from "./settings-card";


export default async function Settings() {

    const Session = await auth()
    if(!Session) redirect('/')
        if(Session)  return <SettingsCard session={Session} />
}
