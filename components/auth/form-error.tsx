import { AlertCircle } from "lucide-react"




export const FormError = ({message} : {message? : string}) => {
 if(!message) return null

     return(
        <div className=" bg-destructive/35 flex items-center  text-sm font-medium text-secondary-foreground p-3 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2"/>
            <p>{message}</p>
        </div>
     )
}
