import Image from "next/image";

export const Logo = () => {
  return (
      <Image
        height={0}
        width={0}
        alt="logo"
        src={"/favicon.ico"}
        priority={true}
        style={{ width: "auto", height: "50px" }}
      />
  );
};