'use client'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'


export default function BackButton({href, label} : {href: string, label: string}) {
  return (
    <div className=' flex justify-center w-full  '>
      <Button className='  w-full ' variant={"link"}>
        <Link className='  ' href={href}> {label}</Link>
      </Button>
    </div>
  )
}
