import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import ProductForm from './product-form'



export default async function addProduct() {
    const session = await auth()

    if(session?.user.role !== 'admin') return redirect('/dashboard/settings')
 

  return (
    <div>
      <ProductForm/>
    </div>
  )
}
  