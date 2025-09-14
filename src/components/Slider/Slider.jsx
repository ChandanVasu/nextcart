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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSliderImages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/data?collection=${COLLECTION}`);
        const data = await res.json();
        if (res.ok) {
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setImages(sorted);
        } else {
          setError("Failed to load images");
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
        setError("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[170px] md:h-[530px] p-4 ">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    );
  }

  // Only show images for desktop (or remove this filter if you want to show all)

  const showFallback = images.length === 0;

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        className="hide-swiper-dots px-6"
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
      >
        {showFallback ? (
          <SwiperSlide>
            <img src="https://placehold.co/1200x600?text=No+Images+Available" alt="Placeholder" className="w-full h-full object-cover" />
          </SwiperSlide>
        ) : (
          images.map((item, index) => (
            <SwiperSlide key={item._id || index} className="p-4">
              <a href={item.url || "#"}>
                <img src={item.image} alt={item.title || `Slide ${index + 1}`} className="w-full h-[150px] md:h-[500px] object-cover rounded-lg" />
              </a>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
}
