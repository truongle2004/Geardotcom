import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Tag } from 'lucide-react';
import { Vendor } from '@/types';

interface VendorFilterProps {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  onSelectedVendor: (vendor: Vendor) => void;
  heightDropDown: string;
}

const VendorFilter = ({
  vendors,
  selectedVendor,
  onSelectedVendor,
  heightDropDown
}: VendorFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          {selectedVendor ? selectedVendor.name : 'Nhà cung cấp'}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-56 ${heightDropDown}`}>
        {vendors?.map((vendor) => (
          <DropdownMenuItem
            key={vendor.id}
            onClick={() => onSelectedVendor(vendor)}
            className="cursor-pointer"
          >
            <Tag className="w-4 h-4 mr-2" />
            {vendor.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VendorFilter;
