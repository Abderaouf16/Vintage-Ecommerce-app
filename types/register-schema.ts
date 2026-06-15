import * as z from 'zod'


 export const RegisterSchema = z.object({
    email: z.string().email({
        message:"invalid Email adress"
    }),
    name: z.string().min(4, {
        message: "Please add a name with at least 4 characters"
    }),
    password: z.string().min(8, {
        message: " Password must be at least 8 chracters long  ",
      }),
  })