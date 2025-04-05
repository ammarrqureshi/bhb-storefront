
"use client"

import React, { useEffect, useState } from "react"
import { getOneProductPerCategory } from "@lib/data/carousel-products"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
// @ts-ignore
//
const ProductCarousel = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOneProductPerCategory()

      // @ts-ignore
      setItems(data)
    }
    fetchData()
  }, [])

  return (
    <div className="my-12 px-4">
      <h2 className="text-3xl font-semibold mb-6">Shop by Category</h2>
      <Swiper slidesPerView={2.5} spaceBetween={20}>
        {items.map(({ category, product }) => (
          <SwiperSlide key={product.id}>
            <div className="relative p-4 bg-white rounded-xl shadow-md">
              <Image
                src={product.thumbnail || "/placeholder.png"}
                alt={product.title}
                width={300}
                height={300}
                className="rounded-lg mb-4 object-cover"
              />
              <h3 className="text-lg font-medium">{product.title}</h3>
              <p className="text-sm text-gray-500">{category}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
export default ProductCarousel;
