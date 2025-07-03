import { PaginatedSelectProps } from '@/types';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from '@/components/ui/select';
import { useRef } from 'react';

const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
  placeholder,
  value,
  onValueChange,
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  disabled = false,
  className,
  error
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const threshold = 10; // Load more when 10px from bottom

    if (
      scrollHeight - scrollTop <= clientHeight + threshold &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <div className="space-y-1">
      <Select
        value={value}
        onValueChange={(selectedValue) => {
          const selectedItem = data.find((item) => item.name === selectedValue);
          onValueChange(selectedValue, selectedItem);
        }}
        disabled={disabled}
      >
        <SelectTrigger
          className={`${className} ${error ? 'border-red-500' : ''}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            <SelectGroup>
              {data.map((item) => (
                <SelectItem key={`${item.code}-${item.id}`} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
              {isFetchingNextPage && (
                <div className="p-2 text-center text-sm text-gray-500">
                  Đang tải thêm...
                </div>
              )}
            </SelectGroup>
          </div>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
export default PaginatedSelect;
