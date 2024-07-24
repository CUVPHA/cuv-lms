"use client";
import * as z from 'zod';
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' 
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@prisma/client';

interface PriceFormProps {
    initialData: Course
    courseId: string;
}

const formSchema = z.object({
    price: z.string().min(1, {
        message: 'Price is required'
    })
})

export const PriceForm = ({
    initialData,
    courseId
}: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const  form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData.price || ''
        
        }
})

const { isSubmitting, isValid } = form.formState;

const toggleEdit = () => setIsEditing((current) => !current);
const router = useRouter();

const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
        await axios.patch(`/api/courses/${courseId}`, values);
        toast.success('Course Price updated')
        toggleEdit()
        router.refresh()
    } catch {
        toast. error('Somthing went wrong')
    }
}
  return (
    <div className='mt-6 border rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            <p>Course Price </p>
            <Button onClick={toggleEdit} variant = 'ghost'>
                {isEditing ? (
                    <>Cancel</>
                ):(
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Price
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className={cn(
                "text-sm mt-2",
                !initialData.price && 'text-slate-400 italic'
            )}>
                {initialData.price || 'No price'}
            </p>
        )}
        {isEditing && (
            <Form {...form}>
               <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea 
                                        disabled={isSubmitting}
                                        placeholder='Course Description Here'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center gap-x-2'>
                        <Button
                            disabled={!isValid || isSubmitting}
                            type='submit'
                        >
                            Save
                        </Button>
                    </div>
               </form>
            </Form>
        )}   
    </div>
  );
}