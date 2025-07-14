import { TakePicture } from "@/domains/post";
import { useRouter } from "expo-router";
import { useState } from "react";

export interface CreatePostParams extends Record<string, unknown> {
  images: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  price?: number;
  description?: string;
  rating?: number;
  calories?: number;
}
export default function CreatePostPage() {
  const router = useRouter();
  const [state, setState] = useState<CreatePostParams>({
    images: [],
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  const handleTakePicture = (images: string[]) => {
    setState(prevState => ({ ...prevState, images }));
    router.push("/");
  };

  return <TakePicture onClose={() => router.push("/")} onTakePicture={handleTakePicture} />;
}
