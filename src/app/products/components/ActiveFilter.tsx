import { ArrowDown, ArrowUp, ArrowUpDown, Tag, X } from 'lucide-react';
import { Category, Vendor } from '@/types';

interface ActiveFiltersProps {
  selectedCategory: Category | null;
  selectedVendor: Vendor | null;
  sortOption: {
    sort: string;
    direction: string;
  };
  isPriceFilterActive: boolean;
  priceRange: number[];
  formatPrice: (price: number) => string;
  onClearCategory: () => void;
  onClearVendor: () => void;
  onClearSort: () => void;
  onClearPrice: () => void;
}

const ActiveFilters = ({
  selectedCategory,
  selectedVendor,
  sortOption,
  isPriceFilterActive,
  priceRange,
  formatPrice,
  onClearCategory,
  onClearVendor,
  onClearSort,
  onClearPrice
}: ActiveFiltersProps) => {
  const getSortIcon = () => {
    if (!sortOption.sort) return <ArrowUpDown className="w-4 h-4" />;
    return sortOption.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const getSortLabel = () => {
    if (!sortOption.sort) return 'Sắp xếp';
    const sortLabels: { [key: string]: string } = {
      name: 'Tên',
      price: 'Giá',
      createdAt: 'Ngày tạo',
      updatedAt: 'Cập nhật'
    };
    const label = sortLabels[sortOption.sort] || sortOption.sort;
    const direction = sortOption.direction === 'asc' ? 'tăng dần' : 'giảm dần';
    return `${label} ${direction}`;
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedVendor ||
    sortOption.sort ||
    isPriceFilterActive;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
      <span className="text-sm font-medium">Đang lọc:</span>

      {selectedCategory && (
        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          <Tag className="w-3 h-3" />
          {selectedCategory.name}
          <button
            onClick={onClearCategory}
            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {selectedVendor && (
        <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
          <Tag className="w-3 h-3" />
          {selectedVendor.name}
          <button
            onClick={onClearVendor}
            className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {isPriceFilterActive && (
        <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
          <Tag className="w-3 h-3" />
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          <button
            onClick={onClearPrice}
            className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {sortOption.sort && (
        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          {getSortIcon()}
          {getSortLabel()}
          <button
            onClick={onClearSort}
            className="ml-1 hover:bg-green-200 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;
