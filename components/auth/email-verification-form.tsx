'use client'

import { newVerificationToken } from "@/server/actions/tokens"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import AuthCard from "./auth-card"
import { FormError } from "./form-error"
import { FormSuccess } from "./form.success"

export const EmailVerificationForm = () => {

    // extract the token from the browser URL
    const token = useSearchParams().get('token')
    const router = useRouter()

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    //memorize the function
    const handleVerification = useCallback(()=> {
        // gard clause will exits immediately because there's no point in re-verifying a token that already failed.
        if(success || error) return 

        if(!token) {
            setError('No token found')
            return
        }

        //.then is a part of an js promise 
        // .then :It is used to specify what should happen once a promise is resolved
        newVerificationToken(token).then((data) => {
            if(data.error) {
                setError(data.error)
            }
            if(data.success) {
                setSuccess(data.success)
                router.push('/auth/login')
            }
        })

    },[])

    // run it just on the first mount
     useEffect(() => {
        handleVerification()
     },[])



    return(
        <AuthCard cardTitle="Verifying your account" backButtonHref="/auth/login" backButtonLabel="Back to login" >
            <div className=" flex items-center flex-col w-full justify-center">
                <p>{!success && !error ? 'Verifying email..' : null} </p>
                <FormSuccess message={success}/>
                <FormError message={error} />
            </div>
        </AuthCard>
    )

}