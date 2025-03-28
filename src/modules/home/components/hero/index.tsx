
"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import Link from "next/link"

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
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
                <Link
                  href="/store"
                  className="bg-white/90 text-black px-10 py-4 rounded-full text-xl font-semibold hover:bg-white transition"
                >
                  Order Now
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

