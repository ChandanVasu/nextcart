"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function SliderCollection() {
  const [collections, setCollections] = useState([]);



  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch("/api/collection");
        const data = await res.json();
        setCollections(data);
      } catch (error) {
        console.error("Failed to load collections:", error);
      }
    }

    fetchCollections();
  }, []);

  if (!collections.length) {
    return <div className="text-center py-12 text-gray-600 text-lg">Loading collections...</div>;
  }

  return (
    <section className="">
      <div className="container mx-auto px-4 md:px-20">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          className="collection-swiper hide-swiper-dots"
          breakpoints={{
            0: { slidesPerView: 3 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 7 },
          }}
        >
          {collections.map((collection) => (
            <SwiperSlide key={collection.id}>
              <div className="flex flex-col items-center text-center">
                <div className="md:w-28 md:h-28 w-24 h-24 rounded-full border border-blue-300 p-1 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md">
                  <img src={collection.image || ""} alt={collection.title} className="w-full h-full rounded-full object-cover object-center" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800 line-clamp-1">{collection.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
