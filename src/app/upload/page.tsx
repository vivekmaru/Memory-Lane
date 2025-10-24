import { PhotoUploader } from '@/components/photo-uploader';

export default function UploadPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Upload Your Memories</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Drag and drop your photos below or click to browse your device. You can generate captions with AI before uploading.
        </p>
      </div>
      <PhotoUploader />
    </div>
  );
}
