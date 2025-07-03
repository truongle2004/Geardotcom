'use client';
import { ModeToggle } from '@/components/ModeToggle';
import SubHeader from '@/components/Subheader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useUserStore from '@/store/userStore';
import { logout } from '@/utils/auth';
import { useKeycloak } from '@react-keycloak/web';
import { Bell, Menu, ShoppingCart, Zap, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { keycloak } = useKeycloak();
  const { userInfo } = useUserStore();
  const router = useRouter();

  const handleSignIn = () => keycloak.login();
  const handleSignOut = () => logout();
  const handleRouteShoppingCart = () => router.push('/account/cart');
  const handleRouteProfile = () => router.push('/account/profile');
  const handleRouteProductPage = () => router.push('/products');

  return (
    <nav className="sticky top-0 z-50 bg-background h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background">
                <nav className="flex flex-col gap-4 mt-8">
                  <a
                    href="#"
                    className="hover:underline text-foreground hover:text-foreground/80"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="hover:underline text-foreground hover:text-foreground/80"
                  >
                    Projects
                  </a>
                  <a
                    href="#"
                    className="hover:underline text-foreground hover:text-foreground/80"
                  >
                    Calendar
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleRouteProductPage}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Geardotcom
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRouteShoppingCart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {/* <ModeToggle /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-md px-1 py-1">
                  <User className="w-5 h-5" />
                  {userInfo?.preferred_username ? (
                    <div>
                      <p className="text-sm">xin chao</p>
                      <p className="text-sm">{userInfo.preferred_username}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm">Đăng nhập</p>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {keycloak.authenticated ? (
                  <>
                    <DropdownMenuItem onClick={handleRouteProfile}>
                      Thông tin tài khoản
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleSignIn}>
                    Đăng nhập
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <SubHeader />
    </nav>
  );
};

export default Header;
