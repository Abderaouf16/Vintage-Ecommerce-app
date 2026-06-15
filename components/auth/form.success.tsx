import { CheckCircle2 } from "lucide-react"


export const FormSuccess = ({message} : {message? : string}) => {
 if(!message) return null

     return(
        <div className=" bg-teal-500/35  flex items-center  text-sm font-medium text-secondary-foreground p-3 rounded-md">
            <CheckCircle2 className="w-4 h-4 mr-2"/>
            <p>{message}</p>
        </div>
     )
}
