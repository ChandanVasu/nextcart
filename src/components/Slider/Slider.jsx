"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function StyleOne() {
  const images = [
    {
      img: "https://www.beyoung.in/api/catalog/Birthday2025/birthday-banner-Desktop-view.jpg",
      alt: "Birthday Banner",
      url: "#",
    },
    {
      img: "https://www.beyoung.in/api/catalog/Birthday2025/partywear-main-Banner-Desktop-view.jpg",
      alt: "Partywear Banner",
      url: "#",
    },
    {
      img: "https://www.beyoung.in/api/catalog/Birthday2025/Trouser-Banner-Desktop-view.jpg",
      alt: "Trouser Banner",
      url: "#",
    },
    {
      img: "https://www.beyoung.in/api/catalog/HomePage2025/rewind-banner-desktop-view.jpg",
      alt: "Jeans Banner",
      url: "#",
    }
  ];

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
          <SwiperSlide key={index}>
            <a href={item.url}>
              <img src={item.img} alt={item.alt} className="w-full h-full object-contain" />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
