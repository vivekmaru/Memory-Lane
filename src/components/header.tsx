import Link from 'next/link';
import { BookOpen, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-md">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight">Memory Lane</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
            My Albums
          </Link>
          <Link href="/story/create" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Create Story
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
