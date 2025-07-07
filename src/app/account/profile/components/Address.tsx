'use client';
import { getUserAddressAPI } from '@/apis/user';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Constant } from '@/constant/constant';
import useDialogStore from '@/store/dialogStore';
import useUserStore from '@/store/userStore';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Eye,
  MapPinHouse,
  MoreHorizontal,
  Navigation,
  Phone,
  Plus,
  User
} from 'lucide-react';
import { useState } from 'react';

const Address = () => {
  const { setIsOpenDialogProfileAddress } = useDialogStore();
  const { userInfo } = useUserStore();
  const [sortOption, setSortOption] = useState<{
    sort: string;
    direction: string;
    search: string;
  }>({
    sort: '',
    direction: '',
    search: ''
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['address-paginated', sortOption.sort, sortOption.search],
      queryFn: ({ pageParam = Constant.DEFAULT_PAGE_NUMBER }) =>
        getUserAddressAPI({
          page: pageParam,
          size: 5,
          sort: sortOption.sort,
          search: sortOption.search
        }),
      getNextPageParam: (lastPage) =>
        lastPage?.data.hasNext ? lastPage?.data.currentPage + 1 : undefined,
      initialPageParam: Constant.DEFAULT_PAGE_NUMBER,
      enabled: userInfo.sub !== ''
    });
  const paginatedData = data?.pages.flatMap((page) => page.data.content) || [];

  const handleSort = (field: string) => {
    const currentSortField = sortOption.sort.split(',')[0];
    let newDirection = 'asc';

    if (currentSortField === field) {
      if (sortOption.direction === 'asc') {
        newDirection = 'desc';
      } else if (sortOption.direction === 'desc') {
        newDirection = '';
      }
    }

    setSortOption({
      ...sortOption,
      sort: newDirection === '' ? '' : `${field},${newDirection}`,
      direction: newDirection
    });
  };

  const getSortIcon = (field: string) => {
    const currentSortField = sortOption.sort.split(',')[0];

    if (currentSortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }

    if (sortOption.direction === 'asc') {
      return <ArrowUp className="w-4 h-4" />;
    } else if (sortOption.direction === 'desc') {
      return <ArrowDown className="w-4 h-4" />;
    }

    return <ArrowUpDown className="w-4 h-4" />;
  };

  const SortableHeader = ({
    field,
    icon: Icon,
    children
  }: {
    field: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <th
      className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{children}</span>
        </div>
        {getSortIcon(field)}
      </div>
    </th>
  );

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="w-full max-w-none">
        <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
          {/* Header */}
          <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <MapPinHouse className="w-5 h-5" />
                  Danh sách địa chỉ
                </h3>
                <p className="text-slate-500">
                  Quản lý địa chỉ giao hàng của bạn
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
                <button
                  className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  Xem tất cả
                </button>
                <button
                  className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => setIsOpenDialogProfileAddress(true)}
                >
                  <Plus className="w-4 h-4" />
                  Thêm địa chỉ mới
                </button>
              </div>
            </div>
          </div>

          {/* Compact Table */}
          <div className="p-0 overflow-x-auto">
            <table className="w-full mt-4 text-left table-auto min-w-max">
              <thead>
                <tr>
                  <SortableHeader field="receiverName" icon={User}>
                    Người nhận
                  </SortableHeader>
                  <SortableHeader field="phoneNumber" icon={Phone}>
                    Số điện thoại
                  </SortableHeader>
                  <SortableHeader field="fullAddress" icon={Navigation}>
                    Địa chỉ
                  </SortableHeader>
                  <th className="p-4 transition-colors border-y border-slate-200 bg-slate-50">
                    <p className="font-sans text-sm font-normal leading-none text-slate-500">
                      Hành động
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="relative inline-block h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-slate-700">
                            {item.receiverName}
                          </p>
                          <p className="text-xs text-slate-500">
                            Người nhận hàng
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <p className="text-sm font-medium text-slate-700">
                          {item.phoneNumber}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <div className="max-w-md">
                        <p className="text-sm font-medium text-slate-700 line-clamp-2">
                          {item.fullAddress}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.ward}, {item.district}, {item.province}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <button
                          className="relative h-8 w-8 select-none rounded-lg text-center align-middle font-sans text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50"
                          type="button"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4 absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                        </button>
                        <button
                          className="relative h-8 w-8 select-none rounded-lg text-center align-middle font-sans text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50"
                          type="button"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4 absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                        </button>
                        <button
                          className="relative h-8 w-8 select-none rounded-lg text-center align-middle font-sans text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50"
                          type="button"
                          title="Thêm tùy chọn"
                        >
                          <MoreHorizontal className="w-4 h-4 absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center p-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded border border-slate-300 py-2.5 px-4 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                {isFetchingNextPage ? 'Đang tải...' : 'Tải thêm'}
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-3">
            <p className="block text-sm text-slate-500">
              Hiển thị {paginatedData.length} địa chỉ
            </p>
            <div className="flex gap-1">
              <button
                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Trước
              </button>
              <button
                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Address;
