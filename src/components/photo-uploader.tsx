"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { generatePhotoCaption } from '@/ai/flows/auto-generate-photo-caption';
import { UploadCloud, Loader2, Wand2, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface UploadedFile {
  file: File;
  preview: string;
  caption: string;
  isGeneratingCaption: boolean;
}

export function PhotoUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
      isGeneratingCaption: false,
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleGenerateCaption = async (index: number) => {
    const fileToCaption = files[index];
    if (!fileToCaption) return;

    setFiles(prev => prev.map((f, i) => i === index ? { ...f, isGeneratingCaption: true } : f));

    try {
      const reader = new FileReader();
      reader.readAsDataURL(fileToCaption.file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const result = await generatePhotoCaption({ photoDataUri: base64 });
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, caption: result.caption, isGeneratingCaption: false } : f));
      };
      reader.onerror = (error) => {
        throw error;
      }
    } catch (error) {
      console.error("Failed to generate caption:", error);
      toast({
        title: "Caption Generation Failed",
        description: "Could not generate a caption for the image. Please try again.",
        variant: "destructive",
      });
      setFiles(prev => prev.map((f, i) => i === index ? { ...f, isGeneratingCaption: false } : f));
    }
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, caption } : f));
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(files[index].preview);
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    // Simulate upload process
    const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
    let uploadedSize = 0;
    const interval = setInterval(() => {
        uploadedSize += totalSize / 10;
        const progress = (uploadedSize / totalSize) * 100;
        setUploadProgress(progress);
        if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setFiles([]);
            toast({
                title: "Upload Complete",
                description: `${files.length} photo${files.length > 1 ? 's' : ''} have been successfully uploaded.`,
            });
        }
    }, 200);
  };

  return (
    <div>
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
          <UploadCloud className="w-16 h-16" />
          <p className="mt-4 text-lg">
            {isDragActive ? 'Drop the photos here...' : 'Drag & drop photos here, or click to select'}
          </p>
          <p className="text-sm">Maximum file size 10MB</p>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 font-headline">Ready to Upload</h2>
          <div className="space-y-4">
            {files.map((uploadedFile, index) => (
              <Card key={index} className="flex items-start p-4 space-x-4 relative overflow-hidden">
                <div className="relative w-32 h-32 rounded-md overflow-hidden shrink-0">
                    <Image src={uploadedFile.preview} alt={uploadedFile.file.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-sm truncate">{uploadedFile.file.name}</p>
                  <div className="relative">
                    <Textarea
                      placeholder="Add a caption..."
                      value={uploadedFile.caption}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      className="pr-24"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1/2 right-1 -translate-y-1/2"
                        onClick={() => handleGenerateCaption(index)}
                        disabled={uploadedFile.isGeneratingCaption}
                    >
                        {uploadedFile.isGeneratingCaption ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        AI Gen
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveFile(index)}>
                    <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
          
          {isUploading && <Progress value={uploadProgress} className="w-full mt-4" />}

          <div className="flex justify-end mt-6">
            <Button size="lg" onClick={handleUpload} disabled={isUploading || files.length === 0}>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Upload {files.length} Photo{files.length > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
