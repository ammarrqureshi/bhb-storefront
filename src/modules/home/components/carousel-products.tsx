
"use client"
import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import CarouselProductPreview from "./products-carousel/carousel-product-preview"

export default function CarouselProducts({ products, region }: any) {
  return (
    <div className="my-10 px-4 relative">
      <h2 className="text-2xl font-bold mb-4">Explore Our Delicious Meals</h2>
      <Swiper
        modules={[Autoplay, Navigation]}
        slidesPerView={1}
        spaceBetween={20}
        navigation
        autoplay={{ delay: 2000 }}
        loop
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="relative"
      >
        {products.map((product: any) => (
          <SwiperSlide key={product.id}>
            <CarouselProductPreview product={product} region={region} />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #d90216;
          padding: 10px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  )
}

