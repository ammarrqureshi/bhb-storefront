
"use client"

import React, { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import Link from "next/link"

import Sandwich from "@modules/common/icons/sandwich"
const slides = [
  {
    id: 1,
    image: "/banners/banner1.png",
  },
  {
    id: 2,
    image: "/banners/banner2.png",
  },
  {
    id: 3,
    image: "/banners/banner3.png",
  },
]

const Hero = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="relative w-full h-[80vh]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Button */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                <Link
                  href="/store"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className={`flex items-center justify-center gap-2 bg-[#D90216] text-white py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${hovered ? "px-12" : "px-8"
                    }`}
                >
                  Order Now
                  <Sandwich
                    size={22}
                    className={`transition-all duration-300 ${hovered
                      ? "opacity-100 scale-100 translate-x-0"
                      : "opacity-0 scale-50 -translate-x-2"
                      }`}
                  />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Hero

