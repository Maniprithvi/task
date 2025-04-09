"use client";
export type ProductCategory =
  | "Electronics"
  | "Fashion"
  | "Grocery"
  | "Books"
  | "Furniture"
  | "";

export type ProductType = "physical" | "digital" | "service" | "";

export interface FilterSidebarProps {
  category: ProductCategory;
  productType: ProductType;
  priceRange: [number, number];
  searchQuery: string;
  onCategoryChange: (category: ProductCategory) => void;
  onProductTypeChange: (type: ProductType) => void;
  onPriceRangeChange: (index: 0 | 1, value: string) => void;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
}
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  category,
  productType,
  priceRange,
  searchQuery,
  onCategoryChange,
  onProductTypeChange,
  onPriceRangeChange,
  onSearchChange,
  onResetFilters,
}) => {
  const handlePriceChange = (index: 0 | 1, value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      onPriceRangeChange(index, value);
    }
  };

  return (
    <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Category</h3>
        <select
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as ProductCategory)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Grocery">Grocery</option>
          <option value="Books">Books</option>
          <option value="Furniture">Furniture</option>
        </select>
      </div>

      {/* Product Type Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Product Type</h3>
        <select
          className="w-full p-2 border rounded"
          value={productType}
          onChange={(e) => onProductTypeChange(e.target.value as ProductType)}
        >
          <option value="">All Types</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
          <option value="service">Service</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Min"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(0, e.target.value)}
            min="0"
          />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Max"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            min={priceRange[0]}
          />
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Search</h3>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Product name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Reset Button */}
      <button
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        onClick={onResetFilters}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
