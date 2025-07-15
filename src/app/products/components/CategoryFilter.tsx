import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Tag } from 'lucide-react';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectedCategory: (category: Category) => void;
  heightDropDown: string;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectedCategory,
  heightDropDown
}: CategoryFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          {selectedCategory ? selectedCategory.name : 'Loại sản phẩm'}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-56 ${heightDropDown}`}>
        {categories?.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => onSelectedCategory(item)}
            className="cursor-pointer"
          >
            <Tag className="w-4 h-4 mr-2" />
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryFilter
