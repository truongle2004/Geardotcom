import Footer from '@/components/Footer';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default HomeLayout;
