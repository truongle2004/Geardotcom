export const convertVND = (num: number) => {
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

