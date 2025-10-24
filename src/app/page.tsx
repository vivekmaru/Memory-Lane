import { AlbumCard } from '@/components/album-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Album } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const albumsData: Omit<Album, 'coverPhotoUrl' | 'dataAiHint'>[] = [
  { id: '1', name: 'Family Vacation', coverPhotoId: 'album-1-cover' },
  { id: '2', name: 'Summer Memories', coverPhotoId: 'album-2-cover' },
  { id: '3', name: 'City Adventures', coverPhotoId: 'album-3-cover' },
  { id: '4', name: 'Our Wedding Day', coverPhotoId: 'album-4-cover' },
  { id: '5', name: 'Baby\'s First Year', coverPhotoId: 'album-5-cover' },
  { id: '6', name: 'Road Trip 2023', coverPhotoId: 'album-6-cover' },
];

function getAlbumCover(album: Omit<Album, 'coverPhotoUrl' | 'dataAiHint'>): Album {
    const placeholder = PlaceHolderImages.find(p => p.id === album.coverPhotoId);
    return {
        ...album,
        coverPhotoUrl: placeholder?.imageUrl || `https://picsum.photos/seed/${album.id}/400/300`,
        dataAiHint: placeholder?.imageHint || 'placeholder'
    };
}

const albums: Album[] = albumsData.map(getAlbumCover);

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold">My Albums</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Album
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
