"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { Skeleton } from "@heroui/skeleton";

const SAMPLE_COLLECTIONS = [
  { id: "sample-1", title: "Sample 1", image: "https://placehold.co/100x100" },
  { id: "sample-2", title: "Sample 2", image: "https://placehold.co/100x100" },
  { id: "sample-3", title: "Sample 3", image: "https://placehold.co/100x100" },
  { id: "sample-4", title: "Sample 4", image: "https://placehold.co/100x100" },
  { id: "sample-5", title: "Sample 5", image: "https://placehold.co/100x100" },
  { id: "sample-6", title: "Sample 6", image: "https://placehold.co/100x100" },
  { id: "sample-7", title: "Sample 7", image: "https://placehold.co/100x100" },
  { id: "sample-8", title: "Sample 8", image: "https://placehold.co/100x100" },
];

export default function SliderCollection({ isTitle = true }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch("/api/collection");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCollections(data);
        } else {
          setCollections(SAMPLE_COLLECTIONS); // use fallback
        }
      } catch (error) {
        console.error("Failed to load collections:", error);
        setCollections(SAMPLE_COLLECTIONS); // fallback on error
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  return (
    <section>
      <div className="container mx-auto px-4 md:px-20">
        {isTitle && (
          <div>
            <h2 className="text-lg md:text-2xl font-semibold mb-2 text-center">Explore Our Collections</h2>
            <p className="text-center text-xs md:text-sm md:mb-8 mb-4">Discover a wide range of collections tailored to your interests</p>
          </div>
        )}

        {loading ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            loop
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
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <SwiperSlide key={`skeleton-${idx}`}>
                    <div className="flex flex-col items-center text-center">
                      <Skeleton className="md:w-28 md:h-28 w-24 h-24 rounded-full" />
                      <Skeleton className="mt-2 h-4 w-20 rounded" />
                    </div>
                  </SwiperSlide>
                ))
              : collections.map((collection) => (
                  <SwiperSlide key={collection.id}>
                    <Link href={`/product?collection=${collection.title}`}>
                      <div className="flex flex-col items-center text-center">
                        <div className="md:w-28 md:h-28 w-24 h-24 rounded-full border border-blue-300 p-1 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md">
                          <img
                            src={collection.image || "https://placehold.co/100x100"}
                            alt={collection.title}
                            className="w-full h-full rounded-full object-cover object-center"
                          />
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-800 line-clamp-1">{collection.title}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
          </Swiper>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            loop
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
                <Link href={`/product?collection=${collection.title}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="md:w-28 md:h-28 w-24 h-24 rounded-full border border-blue-300 p-1 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md">
                      <img
                        src={collection.image || "https://placehold.co/100x100"}
                        alt={collection.title}
                        className="w-full h-full rounded-full object-cover object-center"
                      />
                    </div>
                    <p className="mt-2 md:text-sm text-xs font-medium text-gray-800 line-clamp-1">{collection.title}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
