import { Skeleton } from "../ui/skeleton";

export default function PostSkeleton() {
    return (
        <div className="flex flex-col gap-3 w-full">
            <Skeleton className="w-full h-[100px] rounded-sm bg-gray" />
            <Skeleton className="w-full h-[100px] rounded-sm bg-gray" />
            <Skeleton className="w-full h-[100px] rounded-sm bg-gray" />
            <Skeleton className="w-full h-[100px] rounded-sm bg-gray" />
            <Skeleton className="w-full h-[100px] rounded-sm bg-gray" />
        </div>
    );
}
