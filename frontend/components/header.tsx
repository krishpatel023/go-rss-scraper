"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/providers/auth";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import AddFeed from "./add-feed";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { title: "Feeds", href: "/feeds" },
  { title: "Followed Feeds", href: "/followed-feeds" },
  { title: "Latest Posts", href: "/latest-posts" },
];

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center items-center">
      <div className="w-[95%] md:w-4/5 container flex h-14 justify-between items-center">
        <div className="mr-4 hidden md:flex">
          <Link
            href="/"
            className="mr-10 flex items-center space-x-2"
            suppressHydrationWarning
          >
            <span className="hidden font-bold sm:inline-block hover:cursor-pointer">
              RSS Feed Scraper
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="gap-2 md:gap-4">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      asChild
                      className="text-sm hover:underline underline-offset-2 transition-all duration-100 ease-linear hover:cursor-pointer"
                    >
                      <span>{item.title}</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <AddFeed>
                <div className="text-sm hover:underline underline-offset-2 transition-all duration-100 ease-linear hover:cursor-pointer">
                  Add Feed
                </div>
              </AddFeed>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetDescription className="sr-only">Menu</SheetDescription>
          <DialogTitle className="sr-only">Menu</DialogTitle>

          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="ml-3 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden hover:cursor-pointer"
            >
              <Menu className="min-h-5 min-w-5 h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="pr-0"
            aria-description="Main navigation"
          >
            <Link
              href="/"
              className="flex items-center hover:cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-bold">RSS Feed Scraper</span>
            </Link>
            <Separator className="my-4" />
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            <AddFeed>
              <h1 className="text-sm font-medium transition-colors hover:text-primary pt-4">
                Add Feed
              </h1>
            </AddFeed>
          </SheetContent>
        </Sheet>
        <div className="md:w-auto md:flex-none flex justify-center items-center gap-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

function AuthButton() {
  const { isAuthenticated, signout } = useAuth();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <Link
        href="/login"
        className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 flex justify-center items-center"
        suppressHydrationWarning
      >
        Login
      </Link>
    );

  return (
    <>
      {isAuthenticated ? (
        <Button
          variant="destructive"
          className="max-w-20 w-full md:w-auto"
          size="sm"
          onClick={signout}
        >
          Sign Out
        </Button>
      ) : (
        <Link
          href="/login"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 flex justify-center items-center"
          suppressHydrationWarning
        >
          Login
        </Link>
      )}
    </>
  );
}
