import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string; chapterId: string}}
){
    try {
            const { userId } = auth();

            if(!userId) {
                return new NextResponse("Unauthorized", {status: 401})
            }

            const course = await db.course.findUnique({
                where: {
                    id: params.courseId,
                    userId: userId
                },
            })

            if(!course){
                return new NextResponse("Unauthorized", {status: 401});
            }

            const unpublishedCourse = await db.course.update({
                where:{
                    id: params.courseId,
                },
                data:{
                    isPublished: false,
                }
            });
    
            return NextResponse.json(unpublishedCourse);
        } catch(error) {
            console.log(error)
            return new NextResponse("Internal Error", {status: 500});
        }
}