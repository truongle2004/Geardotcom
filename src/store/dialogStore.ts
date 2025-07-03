import { create } from 'zustand';

interface dialogStore {
  isOpenDialogProfileLogout: boolean;
  isOpenDialogProfileAddress: boolean;
  setIsOpenDialogProfileLogout: (value: boolean) => void;
  setIsOpenDialogProfileAddress: (value: boolean) => void;
}

const useDialogStore = create<dialogStore>((set) => ({
  isOpenDialogProfileLogout: false,
  isOpenDialogProfileAddress: false,
  setIsOpenDialogProfileLogout: (value: boolean) =>
    set({ isOpenDialogProfileLogout: value }),
  setIsOpenDialogProfileAddress: (value: boolean) =>
    set({ isOpenDialogProfileAddress: value })
}));

export default useDialogStore;
