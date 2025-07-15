import { Filter } from 'lucide-react';
import { Category, Vendor } from '@/types';
import { CategoryFilter } from './CategoryFilter';
import ActiveFilters from './ActiveFilter';
import PriceFilter from './PriceFilter';
import SortFilter from './SortFilter';
import VendorFilter from './vendorFilter';

interface FilterContainerProps {
  categories: Category[];
  vendors: Vendor[];
  selectedCategory: Category | null;
  selectedVendor: Vendor | null;
  sortOption: {
    sort: string;
    direction: string;
  };
  priceRange: number[];
  tempPriceRange: number[];
  isPriceFilterActive: boolean;
  dynamicRange: { min: number; max: number };
  formatPrice: (price: number) => string;
  heightDropDown: string;
  onSelectedCategory: (category: Category) => void;
  onSelectedVendor: (vendor: Vendor) => void;
  onSort: (sort: string, direction: string) => void;
  onPriceRangeChange: (range: number[]) => void;
  onApplyPriceFilter: () => void;
  onClearPriceFilter: () => void;
  onClearCategory: () => void;
  onClearVendor: () => void;
  onClearSort: () => void;
}

const FilterContainer = ({
  categories,
  vendors,
  selectedCategory,
  selectedVendor,
  sortOption,
  priceRange,
  tempPriceRange,
  isPriceFilterActive,
  dynamicRange,
  formatPrice,
  heightDropDown,
  onSelectedCategory,
  onSelectedVendor,
  onSort,
  onPriceRangeChange,
  onApplyPriceFilter,
  onClearPriceFilter,
  onClearCategory,
  onClearVendor,
  onClearSort
}: FilterContainerProps) => {
  return (
    <div className="rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5" />
        <span className="font-medium">Bộ lọc</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectedCategory={onSelectedCategory}
          heightDropDown={heightDropDown}
        />

        <SortFilter sortOption={sortOption} onSort={onSort} />

        <PriceFilter
          priceRange={priceRange}
          tempPriceRange={tempPriceRange}
          isPriceFilterActive={isPriceFilterActive}
          dynamicRange={dynamicRange}
          onPriceRangeChange={onPriceRangeChange}
          onApplyPriceFilter={onApplyPriceFilter}
          onClearPriceFilter={onClearPriceFilter}
          formatPrice={formatPrice}
        />

        <VendorFilter
          vendors={vendors}
          selectedVendor={selectedVendor}
          onSelectedVendor={onSelectedVendor}
          heightDropDown={heightDropDown}
        />
      </div>

      <ActiveFilters
        selectedCategory={selectedCategory}
        selectedVendor={selectedVendor}
        sortOption={sortOption}
        isPriceFilterActive={isPriceFilterActive}
        priceRange={priceRange}
        formatPrice={formatPrice}
        onClearCategory={onClearCategory}
        onClearVendor={onClearVendor}
        onClearSort={onClearSort}
        onClearPrice={onClearPriceFilter}
      />
    </div>
  );
};

export default FilterContainer;
