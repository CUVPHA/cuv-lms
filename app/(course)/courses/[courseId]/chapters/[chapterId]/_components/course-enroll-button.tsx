"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
    courseId: string;
    price: number;
}

export const CourseEnrollButton = ({
    courseId,
    price
}: CourseEnrollButtonProps ) => {
    return (
        <div>
            <Button
                size='sm'
                className="w-full md:w-auto"
            >
                Enroll for {formatPrice(price)}
            </Button>
        </div>
    )
};