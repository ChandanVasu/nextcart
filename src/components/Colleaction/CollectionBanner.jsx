import React from "react";

const collections = [
  {
    title: "Women Collections",
    url: "/collections",
    image: "https://static.vecteezy.com/system/resources/previews/053/267/627/non_2x/happy-new-year-sale-2025-design-with-gold-typography-lettering-and-clock-on-glittered-background-holiday-special-offer-campaign-discount-illustration-for-coupon-voucher-banner-flyer-promotional-vector.jpg",
  },
  {
    title: "Women Collections",
    url: "/collections",
    image: "https://img.freepik.com/premium-vector/happy-new-year-sale-2025-design-with-typography-gold-christmas-ball-star-black-background_1314-5872.jpg",
  },
  {
    title: "Women Collections",
    url: "/collections",
    image: "https://cdn.zeebiz.com/sites/default/files/2021/10/31/164466-amazon-dhanteras.jpg",
  },
];

export default function CollectionBanner() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-20 container mx-auto">
      {collections.map((item, idx) => (
        <div key={idx}>
          <a href={item.url}>
            <img src={item.image} alt={item.title} className="w-full md:h-[250px] h-[170px] rounded-lg object-fill object-center" />
          </a>
        </div>
      ))}
    </div>
  );
}
