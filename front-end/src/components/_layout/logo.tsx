import Image from "next/image";

export const Logo = () => {
    return (
        <Image
            alt="logo"
            src={"/favicon.ico"}
            priority={true}
            width={75}
            height={75}
            quality={75}
            blurDataURL="/favicon.ico"
            placeholder="blur"
        />
    );
};