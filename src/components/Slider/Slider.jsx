"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const COLLECTION = "slider-image";

export default function StyleOne() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const res = await fetch(`/api/data?collection=${COLLECTION}`);
        const data = await res.json();
        if (res.ok) {
          // Sort newest first
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setImages(sorted);
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
      }
    };

    fetchSliderImages();
  }, []);

  if (images.length === 0) return null;

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
        className="md:max-h-[600px] max-h-[300px]"
      >
        {images.map((item, index) => (
          <SwiperSlide key={item._id || index}>
            <a href={item.url || "#"}>
              <img src={item.image} alt={item.title || `Slide ${index + 1}`} className="w-full h-full object-contain" />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
