import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'



const CoursePage = async() => {
  const { userId } = auth();

  if(!userId) {
    return redirect('/')
  }

  const courses = await db.course.findMany({
    where:{
      userId: userId
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  return (
    <div>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursePage