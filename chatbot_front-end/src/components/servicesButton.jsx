import React from "react";
import Link from "next/link";

// functional component for buttons in the services page.
// it is called separately for each button and accepts
// item name as props
const ServicesButton = ({ item }) => {
  return (
    // currently, link will lead to log-in page
    <Link href="/" className="w-full h-full">
      {item}
    </Link>
  );
};

export default ServicesButton;
