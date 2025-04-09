"use client";

import { useState, useMemo } from "react";
import useSWR, { useSWRConfig } from "swr";
import Card from "@/component/card";
import { IProduct } from "@/db/types";
import axios from "axios";
import FilterSidebar from "@/component/filter";

type ProductCategory =
  | "Electronics"
  | "Fashion"
  | "Grocery"
  | "Books"
  | "Furniture";
type ProductType = "physical" | "digital" | "service";

interface Product extends IProduct {
  _id: string;
}

interface ApiResponse {
  success: boolean;
  pagination: {
    limit: number;
    nextPageToken: string | null;
    hasNextPage: boolean;
  };
  total: number;
  data: Product[];
}

const fetcher = (url: string) =>
  axios.get<ApiResponse>(url).then((res) => res.data);

const ProductListing = () => {
  // console.log({ url: process.env.NEXT_PUBLIC_BASE_URL });
  const { cache } = useSWRConfig();
  const [cacheSnapshot] = useState(() =>
    Object.fromEntries(Array.from((cache as Map<string, any>).entries()))
  );
  // console.log({ cacheSnapshot });
  // Filter states
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [productType, setProductType] = useState<ProductType | "">("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit] = useState(12); // Removed setLimit since it's not used

  // Pagination states
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [previousTokens, setPreviousTokens] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // Changed to start at 0

  // Query params
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {
      limit: limit.toString(),
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    };

    if (nextPageToken) {
      params.pageToken = nextPageToken;
    } else if (currentPageIndex > 0) {
      // params.page = "1";
    }

    if (category) params.category = category;
    if (productType) params.type = productType;
    if (searchQuery) params.search = searchQuery;

    return params;
  }, [
    limit,
    priceRange,
    nextPageToken,
    currentPageIndex,
    category,
    productType,
    searchQuery,
  ]);

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      ...(nextPageToken && { pageToken: nextPageToken }),
      ...(category && { category }),
      ...(productType && { type: productType }),
      ...(searchQuery && { search: searchQuery }),
    });
    // console.log({ params: params.toString() });

    return `${process.env.NEXT_PUBLIC_BASE_URL}/products?${params.toString()}`;
  }, [limit, priceRange, nextPageToken, category, productType, searchQuery]);

  const { data, mutate, isLoading, error } = useSWR<ApiResponse>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      revalidateIfStale: false,
      onSuccess: (fetchedData) => {
        setNextPageToken(fetchedData.pagination.nextPageToken);
      },
      dedupingInterval: 4000,
    }
  );
  const getCachedData = () => {
    // SWR stores cache with the exact API URL as key
    const cacheKey = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/products?${new URLSearchParams(queryParams).toString()}`;
    // console.log({ key: cacheKey });
    const cachedItem = (cache as Map<string, any>).get(cacheKey);
    // console.log({ cachedItem });
    return cachedItem?.data?.data || []; // Fallback to empty array
  };

  const displayData: Product[] = getCachedData() || data?.data;
  // console.log({ displayData });
  const handlePriceChange = (index: number, value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    setPriceRange((prev) => {
      const newRange = [...prev] as [number, number];
      newRange[index] = numValue;
      return newRange;
    });
  };

  const handlePageChange = async (direction: "next" | "previous" | "reset") => {
    // Reset case
    if (isLoading) return;

    if (direction === "reset") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setNextPageToken(null);
      setPreviousTokens([]);
      setCurrentPageIndex(0);
      await mutate();
      return;
    }

    // Boundary checks
    if (direction === "next" && !data?.pagination.hasNextPage) return;
    if (direction === "previous" && currentPageIndex <= 0) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (direction === "next") {
      setPreviousTokens((prev) =>
        nextPageToken ? [...prev, nextPageToken] : prev
      );
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      const newPreviousTokens = [...previousTokens];
      const prevToken = newPreviousTokens.pop() || null;
      setPreviousTokens(newPreviousTokens);
      setNextPageToken(prevToken);
      setCurrentPageIndex((prev) => prev - 1);
    }
    await mutate();
  };

  const resetFilters = () => {
    setCategory("");
    setProductType("");
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setNextPageToken(null);
    setPreviousTokens([]);
    setCurrentPageIndex(0);
  };

  if (error) return <p className="text-red-500">Error loading products</p>;

  const showingFrom = currentPageIndex * limit + 1;
  const showingTo = Math.min((currentPageIndex + 1) * limit, data?.total || 0);
  const totalProducts = data?.total || 0;

  return (
    <div className="container mx-auto px-4 py-8 h-full w-full">
      <div className="flex flex-col md:flex-row">
        <FilterSidebar
          category={category}
          productType={productType}
          priceRange={priceRange}
          searchQuery={searchQuery}
          onCategoryChange={setCategory}
          onProductTypeChange={setProductType}
          onPriceRangeChange={handlePriceChange}
          onSearchChange={setSearchQuery}
          onResetFilters={resetFilters}
        />

        <div className="flex-1 h-full w-full">
          <div className="bg-white p-4 rounded-lg shadow">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayData.map((product) => (
                    <Card key={product._id} product={product} />
                  ))}
                </div>

                {data?.data && data.data.length > 0 && (
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-600">
                      Showing {showingFrom} to {showingTo} of {totalProducts}{" "}
                      products
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 border rounded disabled:opacity-50"
                        disabled={currentPageIndex === 0}
                        onClick={() => handlePageChange("previous")}
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2">
                        Page {currentPageIndex + 1}
                      </span>
                      <button
                        className="px-4 py-2 border rounded disabled:opacity-50"
                        disabled={!data?.pagination.hasNextPage}
                        onClick={() => handlePageChange("next")}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
