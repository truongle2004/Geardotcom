import z from 'zod';

export const profileAddressSchema = z.object({
  fullname: z.string().min(1, 'Vui lòng nhập họ tên'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  type: z.string().min(1, 'Vui lòng chọn loại địa chỉ')
});
