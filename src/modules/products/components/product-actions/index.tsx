"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}
// Define static checkbox options
const checkboxOptions = [
  { label: "Gift Wrapping", priceIncrease: 5.00, id: "gift_wrapping" },
  { label: "Express Shipping", priceIncrease: 10.00, id: "express_shipping" },
  { label: "Eco-Friendly Packaging", priceIncrease: 2.00, id: "eco_packaging" },
]

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<Record<string, number | null>>({})
  const countryCode = useParams().countryCode as string

  // Preselect options if only one variant
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Handle checkbox toggle
  const handleCheckboxChange = (optionId: string, priceIncrease: number) => {
    setSelectedCheckboxOptions((prev) => ({
      ...prev,
      [optionId]: prev[optionId] ? null : priceIncrease, // Toggle on/off
    }))
  }

  // Calculate total price with checkbox options
  const basePrice = selectedVariant?.prices?.find(
    (p) => p.currency_code === "usd" // Adjust currency as needed
  )?.amount || 0
  const totalCheckboxPrice = Object.values(selectedCheckboxOptions)
    .filter(Boolean)
    .reduce((sum, price) => sum + (price || 0), 0)
  const finalPrice = basePrice + totalCheckboxPrice

  // Set option value for variant selection
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) return true
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // Add to cart with adjusted price
  // In ProductActions
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)
    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
      metadata: {
        selectedCheckboxOptions: Object.entries(selectedCheckboxOptions)
          .filter(([_, value]) => value !== null)
          .map(([id, priceIncrease]) => ({ id, priceIncrease })),
        finalPrice, // Store the adjusted price in metadata
      },
    })
    setIsAdding(false)
  }
  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              ))}
              <Divider />
            </div>
          )}
        </div>

        {/* Checkbox Section */}
        <div className="my-4">
          <h3 className="text-sm font-medium mb-2">Additional Options</h3>
          {checkboxOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id={option.id}
                checked={!!selectedCheckboxOptions[option.id]}
                onChange={() => handleCheckboxChange(option.id, option.priceIncrease)}
                disabled={!!disabled || isAdding}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor={option.id} className="text-sm">
                {option.label} (+${option.priceIncrease.toFixed(2)})
              </label>
            </div>
          ))}
        </div>

        {/* Pass finalPrice to ProductPrice */}
        <ProductPrice product={product} variant={selectedVariant} finalPrice={finalPrice} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
              ? "Out of stock"
              : `Add to cart - $${(finalPrice / 100).toFixed(2)}`} {/* Assuming price in cents */}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
