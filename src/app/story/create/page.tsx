import { StoryCreator } from "@/components/story-creator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateStoryPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative flex justify-center items-center mb-8">
        <Button variant="ghost" asChild className="absolute left-0">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold">Create a New Story</h1>
      </div>
      <StoryCreator />
    </div>
  );
}
