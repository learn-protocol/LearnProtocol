import Image from "next/image";

export default function Loading({ size, white = false }: { size: number; white?: boolean }) {
    if (white) return <Image src="/loading-white.svg" alt="Loading..." height={size} width={size} />;
    return <Image src="/loading.svg" alt="Loading..." height={size} width={size} />;
}
