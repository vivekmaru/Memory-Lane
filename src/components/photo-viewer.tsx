"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Edit, Share, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Photo } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';

export default function PhotoViewer({ photo, albumId }: { photo: Photo, albumId: string }) {
  const router = useRouter();

  const handleClose = () => {
    if (albumId) {
      router.push(`/albums/${albumId}`);
    } else {
      router.back();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col animate-in fade-in-0">
      <TooltipProvider>
        <header className="flex items-center justify-between p-4 border-b shrink-0">
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleClose}>
                    <ArrowLeft />
                    <span className="sr-only">Back to album</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to album</TooltipContent>
              </Tooltip>
              <div>
                <h2 className="font-semibold font-headline">{photo.caption}</h2>
                {albumId && 
                  <Link href={`/albums/${albumId}`} className="text-sm text-muted-foreground hover:underline">
                    Part of Album {albumId}
                  </Link>
                }
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share />
                    <span className="sr-only">Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Download />
                    <span className="sr-only">Download</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Edit />
                    <span className="sr-only">Edit Caption</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Caption</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-4 min-h-0">
          <div className="relative w-full h-full">
              <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  className="object-contain"
                  data-ai-hint={photo.dataAiHint}
              />
          </div>
        </div>
        <div className="absolute top-4 right-4">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                        <X />
                        <span className="sr-only">Close</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
            </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
