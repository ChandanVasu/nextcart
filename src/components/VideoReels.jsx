"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Helper: Extract YouTube Video ID from short or regular URL
const getYoutubeId = (url) => {
  try {
    const u = new URL(url);
    // Handle /shorts/VIDEO_ID
    if (u.pathname.startsWith("/shorts/")) {
      return u.pathname.split("/shorts/")[1];
    }
    // Handle /watch?v=VIDEO_ID
    if (u.searchParams.has("v")) {
      return u.searchParams.get("v");
    }
    // Handle /embed/VIDEO_ID
    if (u.pathname.startsWith("/embed/")) {
      return u.pathname.split("/embed/")[1];
    }
    return null;
  } catch (err) {
    return null;
  }
};

const videoReels = [
  {
    name: "Aarav Sharma",
    videoUrl: "https://www.youtube.com/shorts/1XJvPIZVn5M",
    comment: "Absolutely love it! Worth every penny!",
  },
  {
    name: "Neha Verma",
    videoUrl: "https://www.youtube.com/shorts/n6PoEL09nEs",
    comment: "The product quality is just outstanding!",
  },
  {
    name: "Rohit Jain",
    videoUrl: "https://www.youtube.com/shorts/WwfHXI1ilFs",
    comment: "Fast delivery and amazing service!",
  },
  {
    name: "Priya Singh",
    videoUrl: "https://www.youtube.com/shorts/6or6Cu-fi20",
    comment: "Exceeded my expectations! Highly recommend.",
  },
  {
    name: "Vikram Mehta",
    videoUrl: "https://www.youtube.com/shorts/_EHVpLX56C4",
    comment: "Great value for money. Will buy again!",
  },
  {
    name: "Sita Patel",
    videoUrl: "https://www.youtube.com/shorts/qMeSWqq_ZyQ",
    comment: "Fantastic experience from start to finish!",
  },
];

export default function VideoReelsSlider() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-20">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-3">Customer Reels</h2>
      <p className="text-center text-gray-500 mb-10">See what our happy customers are saying</p>

      <Swiper
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 60000, disableOnInteraction: false }}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 5 },
        }}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Autoplay]}
        className="hide-swiper-dots"
      >
        {videoReels.map((review, idx) => {
          const videoId = getYoutubeId(review.videoUrl);
          return (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden w-full aspect-[9/16] relative group">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&modestbranding=1&rel=0&controls=0&playsinline=1&loop=1&playlist=${videoId}`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>

                <div className="absolute bottom-0 w-full bg-yellow-300/90 text-black p-3">
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs line-clamp-1">{review.comment}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
