"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Helper: Extract YouTube Video ID
const getYoutubeId = (url) => {
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1];
    if (u.searchParams.has("v")) return u.searchParams.get("v");
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1];
    return null;
  } catch {
    return null;
  }
};

export default function VideoReelsSlider() {
  const [videoReels, setVideoReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/data?collection=video-reels");
      const data = await res.json();
      if (res.ok) {
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setVideoReels(sorted);
      } else {
        console.error("Failed to fetch video reels", data);
      }
    } catch (err) {
      console.error("Error fetching reels:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading reels...</p>
      </div>
    );
  }

  if (!videoReels.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No customer reels available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto  px-4 md:px-20">
      <h2 className="text-2xl font-bold text-center mb-3">Customer Reels</h2>
      <p className="text-center  text-base mb-12">Real feedback from our happy customers</p>

      <Swiper
        spaceBetween={20}
        loop
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 5 },
        }}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Autoplay]}
        className="pb-8 hide-swiper-dots"
      >
        {videoReels.map((review, idx) => {
          const videoId = getYoutubeId(review.videoUrl);
          return (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl shadow-lg transition duration-300 ease-in-out overflow-hidden aspect-[9/16] relative group">
                <div className="w-full h-full relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&modestbranding=1&rel=0&controls=0&playsinline=1&loop=1&playlist=${videoId}`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <div className="absolute bottom-0 z-20 p-4 text-white">
                    <p className="text-base font-semibold">{review.name}</p>
                    <p className="text-sm opacity-90 mt-1 line-clamp-1">{review.comment}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
