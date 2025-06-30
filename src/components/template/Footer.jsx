import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const categories = [
    { title: "Men's Fashion", href: "/shop/mens-fashion" },
    { title: "Women's Fashion", href: "/shop/womens-fashion" },
    { title: "Electronics", href: "/shop/electronics" },
    { title: "Home & Kitchen", href: "/shop/home-kitchen" },
    { title: "Beauty & Health", href: "/shop/beauty-health" },
    { title: "Sports & Outdoors", href: "/shop/sports-outdoors" },
  ];

  const customerServiceLinks = [
    { title: "Help Center", href: "/help-center" },
    { title: "Returns & Exchanges", href: "/returns" },
    { title: "Shipping Information", href: "/shipping" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Track Your Order", href: "/track-order" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaTwitter />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaLinkedinIn />, href: "#" },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "news-latter", data: email }),
      });

      if (res.ok) {
        setStatus("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("Subscription failed. Try again.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-10 px-4 sm:px-6 md:px-10 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-4">About NextCart</h3>
          <p className="text-sm text-gray-400">
            NextCart is your go-to destination for the latest in fashion, electronics, and more. We provide a seamless online shopping experience with
            top-notch customer service.
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {customerServiceLinks.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="hover:text-white transition">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop Categories</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {categories.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="hover:text-white transition">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <p className="text-sm text-gray-400 mb-3">Subscribe to get updates on special offers and upcoming deals.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition">
              Subscribe
            </button>
          </form>
          {status && <p className="text-sm text-green-400">{status}</p>}

          <div className="flex justify-center sm:justify-start space-x-4 text-gray-400 mt-4 text-xl">
            {socialLinks.map((item, index) => (
              <a key={index} href={item.href} className="hover:text-white transition" target="_blank" rel="noopener noreferrer">
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} NextCart. All rights reserved.
      </div>
    </footer>
  );
}
