import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const ProductListing = ({ product }: { product: Product }) => {
  // Debugging
  console.log("Product Data:", product);
  console.log("Product Image URL:", product.image ? urlFor(product.image).url() : "No Image");

  return (
    <div>
      <div className="flex flex-col items-center bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
        <Link href={`/Product/${product.id}`}>
          {product.image ? (
            <Image
              src={urlFor(product.image).url()} // Convert ImageUrlBuilder to string URL
              alt={product.name || "Product Image"}
              height={300}
              width={300}
              className="h-[250px] w-full object-cover"
            />
          ) : (
            <p className="text-red-500">Image Not Available</p>
          )}
        </Link>
        <div className="p-4 text-center">
          <p className="text-lg font-medium text-gray-800">{product.name}</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-2">${product.price}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
