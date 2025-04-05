
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import Image from "next/image"

type ProductWithCategory = HttpTypes.StoreProduct & {
  category_title?: string
}

export default function CarouselProductPreview({
  product,
  region,
}: {
  product: ProductWithCategory
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl shadow-md border border-gray-200">
        <Image
          src={product.thumbnail || "/placeholder.png"}
          alt={product.title}
          width={400}
          height={400}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient */}

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-900/80 to-transparent"></div>
        {/* Category Title */}
        {product.category_title && (
          <span className="absolute bottom-5 left-5  text-white text-xl font-medium">
            {product.category_title}
          </span>
        )}

        {/* New Tag */}
        {product.tags?.some((t) => t.value === "New") && (
          <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
            New
          </span>
        )}
      </div>
    </Link>
  )
}

