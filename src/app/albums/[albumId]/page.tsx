import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Photo, Album } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const albumsData: Omit<Album, 'coverPhotoUrl' | 'dataAiHint'>[] = [
  { id: '1', name: 'Family Vacation', coverPhotoId: 'album-1-cover' },
  { id: '2', name: 'Summer Memories', coverPhotoId: 'album-2-cover' },
  { id: '3', name: 'City Adventures', coverPhotoId: 'album-3-cover' },
  { id: '4', name: 'Our Wedding Day', coverPhotoId: 'album-4-cover' },
  { id: '5', name: 'Baby\'s First Year', coverPhotoId: 'album-5-cover' },
  { id: '6', name: 'Road Trip 2023', coverPhotoId: 'album-6-cover' },
];

const photosData: Omit<Photo, 'url' | 'dataAiHint' | 'caption'> & {id: string, albumId: string}[] = [
  { id: 'p1', albumId: '1' }, { id: 'p2', albumId: '1' }, { id: 'p3', albumId: '1' },
  { id: 'p4', albumId: '2' }, { id: 'p5', albumId: '2' },
  { id: 'p6', albumId: '3' }, { id: 'p7', albumId: '3' },
  { id: 'p8', albumId: '4' }, { id: 'p9', albumId: '4' },
  { id: 'p10', albumId: '5' },
  { id: 'p11', albumId: '6' }, { id: 'p12', albumId: '6' },
];

function getPhotoDetails(photoData: {id: string, albumId: string}): Photo {
    const placeholder = PlaceHolderImages.find(p => p.id === photoData.id);
    return {
        ...photoData,
        url: placeholder?.imageUrl || `https://picsum.photos/seed/${photoData.id}/800/600`,
        caption: placeholder?.description || 'A beautiful memory',
        dataAiHint: placeholder?.imageHint || 'placeholder'
    };
}

export default function AlbumPage({ params }: { params: { albumId: string } }) {
  const album = albumsData.find((a) => a.id === params.albumId);
  if (!album) {
    notFound();
  }

  const albumPhotos = photosData
    .filter((p) => p.albumId === params.albumId)
    .map(getPhotoDetails);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Albums
          </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-center flex-1 truncate px-4">{album.name}</h1>
        <Button variant="outline" asChild>
            <Link href="/story/create">
                <Share2 className="mr-2 h-4 w-4" />
                Create Story
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albumPhotos.map((photo) => (
          <Link key={photo.id} href={`/photos/${photo.id}?albumId=${album.id}`}>
            <div className="aspect-square relative overflow-hidden rounded-lg group transition-shadow duration-300 hover:shadow-xl">
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={photo.dataAiHint}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
