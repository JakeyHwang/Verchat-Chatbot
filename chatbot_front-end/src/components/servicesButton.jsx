import React from "react";
import Link from "next/link";

const ServicesButton = ({ item }) => {
  return (
    <Link href="/" className="w-full h-full">
      {item}
    </Link>
  );
};

export default ServicesButton;
