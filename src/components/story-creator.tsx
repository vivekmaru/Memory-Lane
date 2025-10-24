
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { generateStoryPage } from '@/ai/flows/generate-story-page';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Share2, Check, ExternalLink } from 'lucide-react';
import type { Photo } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const allPhotosData = PlaceHolderImages.filter(p => p.id.startsWith('p'));
const allPhotos: Photo[] = allPhotosData.map(p => ({
    id: p.id,
    albumId: 'unknown',
    url: p.imageUrl,
    caption: p.description,
    dataAiHint: p.imageHint,
}));

type StoryPhoto = Photo & { caption: string };

type Story = {
    title: string;
    introduction: string;
    photos: StoryPhoto[];
    conclusion:string;
};

// Helper function to fetch an image and convert it to a data URI
async function toDataURI(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function StoryCreator() {
    const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
    const [theme, setTheme] = useState('');
    const [story, setStory] = useState<Story | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handlePhotoSelect = (photo: Photo, isSelected: boolean) => {
        if (isSelected) {
            setSelectedPhotos(prev => [...prev, photo]);
        } else {
            setSelectedPhotos(prev => prev.filter(p => p.id !== photo.id));
        }
    };

    const handleGenerateStory = async () => {
        if (selectedPhotos.length === 0 || !theme) {
            toast({
                title: 'Missing Information',
                description: 'Please select at least one photo and provide a theme.',
                variant: 'destructive',
            });
            return;
        }

        setIsGenerating(true);
        setStory(null);

        try {
            const photoDataUris = await Promise.all(selectedPhotos.map(p => toDataURI(p.url)));

            const result = await generateStoryPage({
                photoDataUris,
                theme: theme,
            });

            const storyPhotos = result.photos.map((p, index) => ({
                ...selectedPhotos[index],
                caption: p.caption, // This is the new AI-generated caption
            }));
            
            setStory({ ...result, photos: storyPhotos });

        } catch (error) {
            console.error('Failed to generate story:', error);
            toast({
                title: 'Story Generation Failed',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    if (story) {
        return (
            <Card className="animate-in fade-in-0">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-3xl">{story.title}</CardTitle>
                            <CardDescription className="mt-4 text-base">{story.introduction}</CardDescription>
                        </div>
                        <Button>
                            <Share2 className="mr-2 h-4 w-4" /> Share Story
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {story.photos.map((photo, index) => (
                            <div key={index} className="space-y-3">
                                <div className="aspect-video relative rounded-lg overflow-hidden shadow-md">
                                    <Image src={photo.url} alt={photo.caption} fill className="object-cover" />
                                </div>
                                <p className="text-center text-sm italic text-muted-foreground">&ldquo;{photo.caption}&rdquo;</p>
                            </div>
                        ))}
                    </div>
                    <CardDescription className="text-base">{story.conclusion}</CardDescription>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={() => { setStory(null); setSelectedPhotos([]); setTheme(''); }}>Create another story</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">1. Select Photos</CardTitle>
                        <CardDescription>Choose the memories you want to include in your story.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {allPhotos.map(photo => {
                            const isSelected = selectedPhotos.some(p => p.id === photo.id);
                            return (
                                <div key={photo.id} className="relative group">
                                    <label htmlFor={`photo-${photo.id}`} className="cursor-pointer">
                                        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                                            <Image src={photo.url} alt={photo.caption} fill className="object-cover"/>
                                            <div className={`absolute inset-0 bg-black/60 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                            {isSelected && 
                                                <div className="absolute top-2 right-2 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            }
                                        </div>
                                        <Checkbox
                                            id={`photo-${photo.id}`}
                                            className="sr-only"
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handlePhotoSelect(photo, !!checked)}
                                        />
                                    </label>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:sticky lg:top-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">2. Set the Mood</CardTitle>
                        <CardDescription>Give our AI a theme to build the narrative around.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="theme" className="font-semibold">Story Theme</Label>
                            <Input
                                id="theme"
                                placeholder="e.g., A relaxing summer vacation"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleGenerateStory} disabled={isGenerating || selectedPhotos.length === 0} className="w-full">
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generate Story with AI
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
