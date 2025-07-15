import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, Tag } from 'lucide-react';

interface PriceFilterProps {
  priceRange: number[];
  tempPriceRange: number[];
  isPriceFilterActive: boolean;
  dynamicRange: { min: number; max: number };
  onPriceRangeChange: (range: number[]) => void;
  onApplyPriceFilter: () => void;
  onClearPriceFilter: () => void;
  formatPrice: (price: number) => string;
}

const PriceFilter = ({
  priceRange,
  tempPriceRange,
  isPriceFilterActive,
  dynamicRange,
  onPriceRangeChange,
  onApplyPriceFilter,
  onClearPriceFilter,
  formatPrice
}: PriceFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${
            isPriceFilterActive
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : ''
          }`}
        >
          <Tag className="w-4 h-4" />
          {isPriceFilterActive
            ? `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`
            : 'Khoảng giá'}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="text-sm font-medium">Chọn khoảng giá</div>
          <div className="text-xs text-muted-foreground mb-2">
            Khoảng: {formatPrice(dynamicRange.min)} -{' '}
            {formatPrice(dynamicRange.max)}
          </div>
          <Slider
            value={tempPriceRange}
            onValueChange={onPriceRangeChange}
            max={dynamicRange.max}
            min={dynamicRange.min}
            step={Math.max(
              1000,
              Math.floor((dynamicRange.max - dynamicRange.min) / 100)
            )}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(tempPriceRange[0])}</span>
            <span>{formatPrice(tempPriceRange[1])}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onApplyPriceFilter} className="flex-1">
              Áp dụng
            </Button>
            {isPriceFilterActive && (
              <Button size="sm" variant="outline" onClick={onClearPriceFilter}>
                Xóa
              </Button>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriceFilter
