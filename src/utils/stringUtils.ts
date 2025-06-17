const isNotNullAndEmpty = (str: string) => {
  return (
    typeof str === 'string' &&
    str.trim().length !== 0 &&
    str.trim().length !== 1
  );
};

export const stringUtils = {
  isNotNullAndEmpty
};
