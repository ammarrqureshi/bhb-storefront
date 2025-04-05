
import React, { useState, useEffect } from "react"

export const ADDONS = [
  { name: "Extra Cheese", price: 50 },
  { name: "Gift Wrap", price: 100 },
  { name: "Special Packaging", price: 70 },
]
export default function AddonSelector({
  basePrice,
  onAddonChange,
}: {
  basePrice: number
  onAddonChange: (addons: { name: string; price: number }[]) => void
}) {
  const [selectedAddons, setSelectedAddons] = useState([])

  useEffect(() => {
    onAddonChange(selectedAddons)
  }, [selectedAddons])

  const toggleAddon = (addon: { name: string; price: number }) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    )
  }

  return (
    <div className="my-4 p-4 border rounded-xl bg-gray-50">
      <h3 className="font-semibold mb-3">Add-ons (Optional)</h3>
      <div className="flex flex-col gap-2">
        {ADDONS.map((addon) => (
          <label key={addon.name} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedAddons.some((a) => a.name === addon.name)}
              onChange={() => toggleAddon(addon)}
            />
            <span>
              {addon.name} (+ ₹{addon.price})
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
