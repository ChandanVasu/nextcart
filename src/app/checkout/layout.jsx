import React from "react";
import Script from "next/script";

export const metadata = {
  title: "Checkouts",
  keywords: "checkouts, checkout, shopead, ecommerce, online store",
  description: "Checkouts Page",
};

const Layout = ({ children }) => {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {children}
    </>
  );
};

export default Layout;
