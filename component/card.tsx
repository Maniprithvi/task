"use client";

import Image from "next/image";
import { useState } from "react";

import { IProduct } from "@/db/types";

const card = ({ product }: { product: IProduct }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = imageError
    ? "/fallback.jpg"
    : product.images[0] || "/fallback.jpg";

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Image Container with Fallback */}
      <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            onLoadingComplete={(result) => {
              if (result.naturalWidth === 0) setImageError(true);
            }}
            priority={false}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-3">
          {product.description}
        </p>
        <p className="text-lg font-semibold text-gray-900 mb-3">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Tags Container */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {product.category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
            {product.category.toLowerCase()}
          </span>
        )}
        {product.type && (
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full capitalize">
            {product.type.toLowerCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default card;
