"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Skeleton } from "@heroui/skeleton";

const COLLECTION = "slider-image";

export default function StyleOne() {
  const [images, setImages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const fetchSliderImages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/data?collection=${COLLECTION}`);
        const data = await res.json();
        if (res.ok) {
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setImages(sorted);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
        setError("Failed to load images");
        setIsLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  if (isLoading) {
    return (
      <div className={`w-full ${isMobile ? "h-[600px]" : "h-[600px]"}`}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  // Filter images based on screen
  const filteredImages = images.filter((img) => (isMobile ? img.displayFor === "mobile" : img.displayFor === "desktop"));

  if (filteredImages.length === 0) return null;

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className={isMobile ? "h-[600px]" : "h-[600px]"}
      >
        {filteredImages.map((item, index) => (
          <SwiperSlide key={item._id || index}>
            <a href={item.url || "#"}>
              <img src={item.image} alt={item.title || `Slide ${index + 1}`} className="w-full h-full object-cover" />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
