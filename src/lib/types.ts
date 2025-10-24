export interface Photo {
  id: string;
  url: string;
  caption: string;
  albumId: string;
  dataAiHint: string;
}

export interface Album {
  id: string;
  name: string;
  coverPhotoId: string;
  coverPhotoUrl: string;
  dataAiHint: string;
}
