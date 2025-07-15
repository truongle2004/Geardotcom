import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from 'lucide-react';

interface SortFilterProps {
  sortOption: {
    sort: string;
    direction: string;
  };
  onSort: (sort: string, direction: string) => void;
}

const SortFilter = ({ sortOption, onSort }: SortFilterProps) => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {getSortIcon()}
          {getSortLabel()}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          onClick={() => onSort('name', 'asc')}
          className="cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          Tên A-Z
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSort('name', 'desc')}
          className="cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 mr-2" />
          Tên Z-A
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSort('price', 'asc')}
          className="cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          Giá thấp đến cao
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSort('price', 'desc')}
          className="cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 mr-2" />
          Giá cao đến thấp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSort('createdAt', 'desc')}
          className="cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 mr-2" />
          Mới nhất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortFilter;
