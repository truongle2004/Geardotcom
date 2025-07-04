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


export const accountInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .regex(
      /^[a-zA-ZÀ-ỹ\s]+$/,
      'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
    ),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Vui lòng chọn giới tính'
  }),
  phone: z
    .string()
    .regex(/^(\+84|0)[1-9]\d{8}$/, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại phải có ít nhất 10 số'),
  email: z.string().email('Email không hợp lệ'),
  birthDate: z
    .date({
      required_error: 'Vui lòng chọn ngày sinh'
    })
    .refine((date) => {
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
      );
      return date <= today && date >= minDate;
    }, 'Ngày sinh không hợp lệ')
});

