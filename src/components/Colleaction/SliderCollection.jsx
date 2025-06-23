"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { Skeleton } from "@heroui/skeleton";

export default function SliderCollection({ isTitle = true }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch("/api/collection");
        const data = await res.json();
        setCollections(data);
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  return (
    <section className="">
      <div className="container mx-auto px-4 md:px-20">
        {isTitle && (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-center">Explore Our Collections</h2>
            <p className="text-center mb-8">Discover a wide range of collections tailored to your interests</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-center">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <Skeleton className="md:w-28 md:h-28 w-24 h-24 rounded-full" />
                <Skeleton className="mt-2 h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        ) : collections.length ? (
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
                <Link href={`/`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="md:w-28 md:h-28 w-24 h-24 rounded-full border border-blue-300 p-1 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md">
                      <img src={collection.image || ""} alt={collection.title} className="w-full h-full rounded-full object-cover object-center" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-800 line-clamp-1">{collection.title}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-500 py-10">No collections available.</div>
        )}
      </div>
    </section>
  );
}
