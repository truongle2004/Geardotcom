'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Menu, ShoppingCart } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { useKeycloak } from '@react-keycloak/web';
import { logout } from '@/utils/auth';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { keycloak } = useKeycloak();
  const handleSignIn = () => {
    keycloak.login();
  };

  const router = useRouter();

  const handleRouteShoppingCart = () => {
    router.push('/cart');
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden">
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

        {/* Logo */}
        <div className="text-lg font-semibold text-foreground">
          <a href="#">MyApp</a>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden sm:flex gap-6">
          <a
            href="#"
            className="text-foreground hover:text-foreground/80 transition-colors"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-foreground hover:text-foreground/80 transition-colors"
          >
            Team
          </a>
          <a
            href="#"
            className="text-foreground hover:text-foreground/80 transition-colors"
          >
            Projects
          </a>
          <a
            href="#"
            className="text-foreground hover:text-foreground/80 transition-colors"
          >
            Calendar
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleRouteShoppingCart}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              {keycloak.authenticated && (
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              )}
              {!keycloak.authenticated && (
                <DropdownMenuItem onClick={handleSignIn}>
                  Sign in
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
