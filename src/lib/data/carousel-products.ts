
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const getCarouselProducts = async () => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  // Fetch all categories with products
  const { product_categories } = await sdk.client.fetch<{
    product_categories: HttpTypes.StoreProductCategory[]
  }>("/store/product-categories", {
    query: {
      fields: "*category_children, *products",
    },
    next,
    cache: "no-store",
  })

  const productPromises = product_categories.map(async (category) => {
    if (category.products && category.products.length > 0) {
      const product = category.products[0]
      return {
        ...product,
        category_title: category.name, // Attach category name
      }
    }
    return null
  })

  const products = await Promise.all(productPromises)

  // Remove nulls
  return products.filter((p) => p !== null)
}

