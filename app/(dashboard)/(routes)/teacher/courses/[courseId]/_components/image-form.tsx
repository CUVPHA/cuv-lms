"use client";

import * as z from 'zod';
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button' 
import { useState } from 'react';
import { ImageIcon, Pencil, PlusCircle, PlusCircleIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface ImageFormProps {
    initialData:Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: 'Image is required'
    })
})

export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const  form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData.imageUrl || '',
        }
})

const toggleEdit = () => setIsEditing((current) => !current);
const router = useRouter();

const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
        await axios.patch(`/api/courses/${courseId}`, values);
        toast.success('Course Image updated')
        toggleEdit()
        router.refresh()
    } catch {
        toast. error('Somthing went wrong')
    }
}
  return (
    <div className='mt-6 border rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            <p>Course Image </p>
            <Button onClick={toggleEdit} variant = 'ghost' className='mb-2'>
                {isEditing && (
                    <>Cancel</>
                )}

                {!isEditing && !initialData.imageUrl && (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add Image
                    </>
                )}
                
                {!isEditing && initialData.imageUrl &&(
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Image
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            !initialData.imageUrl ? (
                <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                    <ImageIcon className='h-10 w-10 text-slate-500 mt-2' />
                </div>
            ):(
                <div className='relative aspect-video mt-2'>
                    <Image
                        src={initialData.imageUrl}
                        fill
                        className='object-cover rounded-md'
                        alt='Upload'
                        />
                </div>
            )
        )}
        {isEditing && (
            <div>
                <FileUpload
                    endpoint='courseImage'
                    onChange={(url) => {
                        if(url){
                            onSubmit({imageUrl: url});
                        }
                    }}
                />
                <div className='text-xs text-muted-foreground mt-4'>
                    16:9 aspect ratio recommended
                </div>
            </div>
            
        )}   
    </div>
  );
}