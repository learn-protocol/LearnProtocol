"use client";

import Link from "next/link";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function CategoryCarousel({ categories = [] }: { categories: string[] }) {
    return (
        <Carousel
            className="categories w-full"
            opts={{
                align: "start",
                loop: true,
            }}
        >
            <CarouselContent>
                {categories.map((category, i) => (
                    <CarouselItem key={i} className="flex items-center justify-center w-fit basis-1/5">
                        <div className="category">
                            <Link href={`/category/${category.toLowerCase()}`}>{category}</Link>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
        </Carousel>
    );
}
