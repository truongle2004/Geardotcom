import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { RouteEnum } from '@/enums/enums';
import type { Product } from '@/types';
import { convertVND } from '@/utils/vnd';
import { Eye, Monitor, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface ProductCardProps {
  product: Product;
  handleAddToCart: (id: string, quantity: number) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, handleAddToCart }) => {
  return (
    <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <CardHeader className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3]">
          <Link href={`${RouteEnum.DETAIL}/${product.id}/${product.handle}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              {product.productImage ? (
                <Image
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  src={product.images[0].src}
                  alt={
                    product.images[0].alt || product.title || 'Product image'
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <Monitor className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </Link>
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge className="text-xs bg-red-500 hover:bg-red-600">
              Gaming
            </Badge>
          </div>
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 text-xs bg-green-500 text-white hover:bg-green-600"
          >
            Hot
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 flex-grow flex flex-col">
        <Link href={`${RouteEnum.DETAIL}/${product.id}/${product.handle}`}>
          <h3 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.reviewCount})</span>
        </div>

        {/* Price - pushed to bottom of flex container */}
        <div className="mt-auto mb-2">
          <div className="text-lg font-bold text-red-600">Liên hệ</div>
          <div className="text-xs text-gray-500">
            {convertVND(product.price)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex gap-2">
        <Button
          className="flex-1 text-xs"
          size="sm"
          onClick={() => handleAddToCart(product.id, 1)}
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          Thêm vào giỏ
        </Button>
        <Button variant="outline" size="sm" className="px-2">
          <Eye className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
