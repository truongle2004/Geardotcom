import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
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
  // Extract key specs from tags
  // const getSpecValue = (key: string) => {
  //   const tag = product.tags.split(',').find((t) => t.includes(key));
  //   return tag ? tag.split(':')[1] : null;
  // };

  // // TODO: we need more specs
  // const size = getSpecValue('spec_Kích thước');
  // const refreshRate = getSpecValue('spec_Tần số quét');
  // const panel = getSpecValue('spec_Tấm nền');
  // const resolution = getSpecValue('spec_Độ phân giải');
  // const brightness = getSpecValue('spec_Độ sáng');
  // const responseTime = getSpecValue('spec_Thời gian phản hồi');
  // const warranty = getSpecValue('spec_Bảo hành');

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <CardHeader className="p-0">
        {/* Product Image */}

        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3]">
          <Link href={`${RouteEnum.DETAIL}/${product.id}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              {product.productImage ? (
                <Image
                  className="object-cover w-full h-full"
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.title || 'Product image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <Monitor className="w-16 h-16 text-gray-400" />
              )}
            </div>
          </Link>
          {/* Gaming Badge */}
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
            Gaming
          </Badge>
          {/* Discount Badge - Example */}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-green-500 text-white hover:bg-green-600"
          >
            Hot
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow flex flex-col">
        <Link href={`${RouteEnum.DETAIL}/${product.id}`}>
          <CardTitle className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </CardTitle>
        </Link>

        {/* Key Specs */}
        {/* <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            {size && (
              <div className="flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600">{size}</span>
              </div>
            )}
            {refreshRate && (
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600">{refreshRate}</span>
              </div>
            )}
            {resolution && (
              <div className="flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600">{resolution}</span>
              </div>
            )}
            {panel && (
              <div className="flex items-center gap-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  {panel}
                </span>
              </div>
            )}
          </div> */}

        {/* Additional Specs */}
        {/* <div className="flex flex-wrap gap-1 mb-3">
            {responseTime && (
              <Badge variant="outline" className="text-xs">
                {responseTime}
              </Badge>
            )}
            {brightness && (
              <Badge variant="outline" className="text-xs">
                {brightness}
              </Badge>
            )}
          </div> */}

        {/* Warranty */}
        {/* {warranty && (
            <div className="text-sm text-green-600 font-medium mb-3">
              Bảo hành: {warranty}
            </div>
          )} */}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount} đánh giá)
          </span>
        </div>

        {/* Price - pushed to bottom of flex container */}
        <div className="mt-auto mb-4">
          <div className="text-xl font-bold text-red-600">Liên hệ</div>
          {/* <div className="text-sm text-gray-500 line-through"> */}
            {convertVND(product.price)}
          {/* </div> */}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2 mt-auto">
        <Button
          className="flex-1"
          size="sm"
          onClick={() => handleAddToCart(product.id, 1)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm vào giỏ
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
