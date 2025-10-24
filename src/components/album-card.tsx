import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Album } from '@/lib/types';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/albums/${album.id}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border-border/80">
        <CardContent className="p-0">
          <div className="aspect-[4/3] relative">
            <Image
              src={album.coverPhotoUrl}
              alt={album.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={album.dataAiHint}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-card">
          <h3 className="font-headline font-semibold text-lg truncate">{album.name}</h3>
        </CardFooter>
      </Card>
    </Link>
  );
}
