import React from "react";
import Link from "next/link";

const ServicesButton = ({ item }) => {
  return <Link href="/">{item}</Link>;
};

export default ServicesButton;
