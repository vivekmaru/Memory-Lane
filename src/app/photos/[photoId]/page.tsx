import { notFound } from 'next/navigation';
import type { Photo } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import PhotoViewer from '@/components/photo-viewer';

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
        url: placeholder?.imageUrl.replace('800/600', '1600/1200').replace('400/300', '1600/1200') || `https://picsum.photos/seed/${photoData.id}/1600/1200`,
        caption: placeholder?.description || 'A beautiful memory',
        dataAiHint: placeholder?.imageHint || 'placeholder'
    };
}

export default function PhotoPage({ params, searchParams }: { params: { photoId: string }, searchParams: { albumId: string } }) {
  const photoData = photosData.find((p) => p.id === params.photoId);

  if (!photoData) {
    notFound();
  }
  
  const photo = getPhotoDetails(photoData);

  return <PhotoViewer photo={photo} albumId={searchParams.albumId} />;
}
