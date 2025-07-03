'use client';
import { getDistrictAPI, getProvinceAPI, getWardAPI } from '@/apis/user';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDialogStore from '@/store/dialogStore';
import { District, Province, Ward } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { profileAddressSchema } from '../../../../../schema';
import PaginatedSelect from './PaginatedSelect';

type ProfileAddressFormData = z.infer<typeof profileAddressSchema>;

const DialogAddress = () => {
  const [selectedButtonIdx, setSelectedButtonIdx] = useState(1); // Default to 'Văn phòng'
  const { isOpenDialogProfileAddress, setIsOpenDialogProfileAddress } =
    useDialogStore();

  const [selectedCodes, setSelectedCodes] = useState({
    provinceCode: '',
    districtCode: ''
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProfileAddressFormData>({
    resolver: zodResolver(profileAddressSchema),
    defaultValues: {
      fullname: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      type: 'office' // Default to 'Văn phòng'
    }
  });

  const watchedCity = watch('city');
  const watchedDistrict = watch('district');

  const styleWidth = 'w-[210px]';
  const styleButtonSelected = 'border-red-500 text-red-500 hover:text-red-500';

  //==================Call Api Address===================
  const {
    data: districtsData,
    fetchNextPage: fetchNextDistricts,
    hasNextPage: hasNextDistrictPage,
    isFetchingNextPage: isFetchingNextDistrict,
    isLoading: districtsLoading
  } = useInfiniteQuery({
    queryKey: ['districts-paginated', selectedCodes.provinceCode],
    queryFn: ({ pageParam = 0 }) =>
      getDistrictAPI(pageParam, 50, selectedCodes.provinceCode),
    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasNext ? lastPage?.data?.currentPage + 1 : undefined,
    enabled: !!selectedCodes.provinceCode,
    initialPageParam: 0
  });

  const {
    data: wardsData,
    fetchNextPage: fetchNextWards,
    hasNextPage: hasNextWardPage,
    isFetchingNextPage: isFetchingNextWard,
    isLoading: wardsLoading
  } = useInfiniteQuery({
    queryKey: ['wards-paginated', selectedCodes.districtCode],
    queryFn: ({ pageParam = 0 }) =>
      getWardAPI(pageParam, 50, selectedCodes.districtCode),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    enabled: !!selectedCodes.districtCode,
    initialPageParam: 0
  });

  const {
    data: provincesData,
    fetchNextPage: fetchNextProvinces,
    hasNextPage: hasNextProvincePage,
    isFetchingNextPage: isFetchingNextProvince,
    isLoading: provincesLoading
  } = useInfiniteQuery({
    queryKey: ['provinces-paginated'],
    queryFn: ({ pageParam = 0 }) => getProvinceAPI(pageParam, 50),
    getNextPageParam: (lastPage) =>
      lastPage?.data.hasNext ? lastPage?.data.currentPage + 1 : undefined,
    initialPageParam: 0
  });
  // ====================Call Api Address===================

  // ===================Handle Data===================
  const provinces =
    provincesData?.pages.flatMap((page) => page.data.content) || [];
  const districts =
    districtsData?.pages.flatMap((page) => page.data.content) || [];
  const wards = wardsData?.pages.flatMap((page) => page.data.content) || [];
  // ===================Handle Data===================

  // ===================Handle Function===================
  const handleSelected = (index: number, type: string) => {
    setSelectedButtonIdx(index);
    setValue('type', type);
  };

  const handleProvinceChange = (value: string, province: Province) => {
    setValue('city', value);
    setValue('district', ''); // Reset district when province changes
    setValue('ward', ''); // Reset ward when province changes
    setSelectedCodes((prev) => ({
      ...prev,
      provinceCode: province.code.toString(),
      districtCode: '' // Reset district code
    }));
  };

  const handleDistrictChange = (value: string, district: District) => {
    setValue('district', value);
    setValue('ward', ''); // Reset ward when district changes
    setSelectedCodes((prev) => ({
      ...prev,
      districtCode: district.code.toString()
    }));
  };

  const handleWardChange = (value: string, ward: Ward) => {
    setValue('ward', value);
  };

  // ===================Handle Function===================

  const onSubmit = (data: ProfileAddressFormData) => {
    console.log('Submitting new address:', data);
    console.log('Selected codes:', selectedCodes);

    // TODO: Call API to save address
    // You can also include the codes for backend processing
    const addressData = {
      ...data,
      provinceCode: selectedCodes.provinceCode,
      districtCode: selectedCodes.districtCode
    };

    // setIsOpenDialogProfileAddress(false);
  };

  // reset form data
  useEffect(() => {
    if (!isOpenDialogProfileAddress) {
      reset();
      setSelectedCodes({
        provinceCode: '',
        districtCode: ''
      });
      setSelectedButtonIdx(1); // Reset to default
    }
  }, [isOpenDialogProfileAddress, reset]);

  if (provincesLoading) {
    return <LoadingOverlay />;
  }

  return (
    <Dialog
      open={isOpenDialogProfileAddress}
      onOpenChange={setIsOpenDialogProfileAddress}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="border-b-black">
          <DialogTitle>Địa chỉ mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {/* Thông tin khách hàng */}
            <div className="grid gap-3">
              <Label>Thông tin khách hàng</Label>

              <div className="space-y-1">
                <Controller
                  name="fullname"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="fullname"
                      placeholder="Nhập họ và tên"
                      type="text"
                      className={errors.fullname ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.fullname && (
                  <p className="text-sm text-red-500">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="grid gap-3">
              <Label>Địa chỉ</Label>

              {/* Row 1: Province and Ward */}
              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <PaginatedSelect
                      placeholder="Chọn Tỉnh/Thành phố"
                      value={field.value}
                      onValueChange={handleProvinceChange}
                      data={provinces}
                      hasNextPage={hasNextProvincePage || false}
                      fetchNextPage={fetchNextProvinces}
                      isFetchingNextPage={isFetchingNextProvince}
                      className={styleWidth}
                      error={errors.city?.message}
                    />
                  )}
                />

                <Controller
                  name="ward"
                  control={control}
                  render={({ field }) => (
                    <PaginatedSelect
                      placeholder="Chọn Phường/Xã"
                      value={field.value}
                      onValueChange={handleWardChange}
                      data={wards}
                      hasNextPage={hasNextWardPage || false}
                      fetchNextPage={fetchNextWards}
                      isFetchingNextPage={isFetchingNextWard}
                      disabled={!selectedCodes.districtCode}
                      className={styleWidth}
                      error={errors.ward?.message}
                    />
                  )}
                />
              </div>

              {/* Row 2: District and Specific Address */}
              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <PaginatedSelect
                      placeholder="Chọn Quận/Huyện"
                      value={field.value}
                      onValueChange={handleDistrictChange}
                      data={districts}
                      hasNextPage={hasNextDistrictPage || false}
                      fetchNextPage={fetchNextDistricts}
                      isFetchingNextPage={isFetchingNextDistrict}
                      disabled={!selectedCodes.provinceCode}
                      className={styleWidth}
                      error={errors.district?.message}
                    />
                  )}
                />

                <div className="space-y-1">
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Địa chỉ cụ thể"
                        className={`${styleWidth} ${errors.address ? 'border-red-500' : ''}`}
                      />
                    )}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Loại địa chỉ */}
            <div className="grid gap-3">
              <Label>Loại địa chỉ</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className={selectedButtonIdx === 1 ? styleButtonSelected : ''}
                  onClick={() => handleSelected(1, 'office')}
                >
                  Văn phòng
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={selectedButtonIdx === 2 ? styleButtonSelected : ''}
                  onClick={() => handleSelected(2, 'home')}
                >
                  Nhà riêng
                </Button>
              </div>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Hủy
              </Button>
            </DialogClose>
            <Button className="bg-red-500 hover:bg-red-600" type="submit">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddress;
