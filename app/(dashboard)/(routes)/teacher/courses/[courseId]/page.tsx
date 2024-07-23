import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { IconBadge } from '@/components/icon-badge'
import { LayoutDashboard } from 'lucide-react'
import { TitleForm } from './_components/title-form'

const CourseIdPage = async ({
    params
}: {
    params: {
        courseId: string
    }
}) => {
    const {userId} = auth()

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        }
    })

    if(!userId) {
        return redirect('/')
    }

    if(!course){
        return redirect('/')
    }

    const requiredFields = [
        course.title,
        course.description,
        course.price,
        course.imageUrl,
        course.categoryId
    ];

    const totalfields = requiredFields.length; // Get the total number required fields
    const completedFields = requiredFields.filter(Boolean).length; // Get the number of fields that have been completed

    const completionText = `(${completedFields} / ${totalfields})`;

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>
                        Course Setup
                    </h1>
                    <span className='text-sm'>
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div className='flex items-center gap-x-2'>
                    <IconBadge icon = {LayoutDashboard} />
                    <h2 className='text-xl'>
                        Customize your course
                    </h2>
                </div>
                <TitleForm 
                initialData={course}
                courseId={course.id}
                />
            </div>
        </div>
    )
}

export default CourseIdPage