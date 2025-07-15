'use client';

import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Heart,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Play,
  Shield,
  ShoppingCart,
  Smartphone,
  Star,
  Truck,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// TypeScript interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  productCount: number;
  image: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Mock data
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3',
    description: 'Professional laptop with M3 chip, 32GB RAM, 1TB SSD',
    price: 2499,
    originalPrice: 2799,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
    category: 'Laptops',
    rating: 4.9,
    reviews: 847,
    isNew: true,
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Gaming Desktop RTX 4080',
    description: 'High-performance gaming PC with RTX 4080, Intel i7-13700K',
    price: 1899,
    originalPrice: 2199,
    image:
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=400&fit=crop',
    category: 'Desktops',
    rating: 4.8,
    reviews: 523,
    isBestSeller: true
  },
  {
    id: '3',
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with titanium design, 256GB storage',
    price: 1199,
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop',
    category: 'Smartphones',
    rating: 4.7,
    reviews: 1247,
    isNew: true
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    description: 'Premium noise-cancelling wireless headphones',
    price: 399,
    originalPrice: 449,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    category: 'Audio',
    rating: 4.6,
    reviews: 892
  }
];

const categories: Category[] = [
  {
    id: '1',
    name: 'Laptops',
    icon: <Laptop className="w-8 h-8" />,
    productCount: 156,
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Desktops',
    icon: <Monitor className="w-8 h-8" />,
    productCount: 89,
    image:
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Smartphones',
    icon: <Smartphone className="w-8 h-8" />,
    productCount: 234,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Audio',
    icon: <Headphones className="w-8 h-8" />,
    productCount: 127,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'Accessories',
    icon: <Mouse className="w-8 h-8" />,
    productCount: 312,
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    name: 'Gaming',
    icon: <Keyboard className="w-8 h-8" />,
    productCount: 198,
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'
  }
];

const features: Feature[] = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: 'Free Shipping',
    description: 'Free delivery on orders over $99'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: '2-Year Warranty',
    description: 'Extended warranty on all products'
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Expert Support',
    description: '24/7 technical assistance'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Fast Delivery',
    description: 'Same-day delivery available'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export default function Homepage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };
  const router = useRouter();
  const routeProductPage = () => {
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${featuredProducts[currentSlide].image})`,
            transform: 'scale(1.1)'
          }}
        ></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">
              {featuredProducts[currentSlide].isNew && 'New Arrival'}
              {featuredProducts[currentSlide].isBestSeller &&
                !featuredProducts[currentSlide].isNew &&
                'Best Seller'}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Latest Tech
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Gear
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Discover cutting-edge technology and premium gadgets for
              professionals and enthusiasts
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100"
                onClick={routeProductPage}
              >
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find exactly what you need from our carefully curated selection of
              premium tech products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-200">
                      {category.productCount} products
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked favorites from our tech experts
              </p>
            </div>
            <Button variant="outline">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.isNew && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        New
                      </Badge>
                    )}
                    {product.isBestSeller && (
                      <Badge className="bg-orange-500 hover:bg-orange-600">
                        Best Seller
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                    onClick={() => toggleLike(product.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedProducts.includes(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </Button>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {product.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {product.category}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-lg opacity-90">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get notified about new products, exclusive deals, and tech news
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <Input placeholder="Enter your email" className="flex-1" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
