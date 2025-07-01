import React from "react";
import { Flame, Star, Tag, Gift, BadgeDollarSign, Sparkles, TrendingUp } from "lucide-react";

const labelStyles = {
  Trending: {
    class: "bg-yellow-400 text-black",
    icon: <TrendingUp size={14} className="mr-1" />,
  },
  New: {
    class: "bg-blue-500 text-white",
    icon: <Sparkles size={14} className="mr-1" />,
  },
  Hot: {
    class: "bg-red-500 text-white",
    icon: <Flame size={14} className="mr-1" />,
  },
  "Best Seller": {
    class: "bg-green-500 text-white",
    icon: <Star size={14} className="mr-1" />,
  },
  "Limited Edition": {
    class: "bg-purple-600 text-white",
    icon: <Gift size={14} className="mr-1" />,
  },
  Sale: {
    class: "bg-pink-500 text-white",
    icon: <BadgeDollarSign size={14} className="mr-1" />,
  },
  Exclusive: {
    class: "bg-gray-800 text-white",
    icon: <Tag size={14} className="mr-1" />,
  },
};

export default function ProductLabel({ label }) {
  if (!label || !labelStyles[label]) return null;

  const { class: bgClass, icon } = labelStyles[label];

  return (
    <span
      className={`
    absolute top-2 left-2
    px-1.5 py-0.5 
    text-[10px] sm:text-xs 
    font-semibold rounded 
    flex items-center gap-1 
    ${bgClass}
  `}
    >
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}
