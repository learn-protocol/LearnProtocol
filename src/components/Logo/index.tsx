import Image from "next/image";

export default function Logo({ size }: { size: number }) {
    return (
        <Image
            src="/logo.svg"
            alt="Learn Protocol Logo"
            height={size}
            width={size}
            style={{
                minWidth: size,
                minHeight: size,
            }}
            quality={100}
        />
    );
}
