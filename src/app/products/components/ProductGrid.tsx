import { Grid } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (productId: string, quantity: number) => void;
}

const ProductGrid = ({
  products,
  isLoading,
  onAddToCart
}: ProductGridProps) => {
  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Không tìm thấy sản phẩm</h3>
        <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={`${product.id}-${index}`}
          product={product}
          handleAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
