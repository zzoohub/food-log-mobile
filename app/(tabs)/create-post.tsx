import { TakePicture } from "@/domains/post";
import { useFunnel } from "@/components/utils";
import { useRouter } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { CreatePostForm } from "@/domains/post";

export type CreatePostSteps = ["take-picture", "form"];
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
  const [Funnel, state, setState] = useFunnel<CreatePostSteps, CreatePostParams>(["take-picture", "form"]).withState({
    images: [],
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  const router = useRouter();

  return (
    <Funnel>
      <Funnel.Step name="take-picture">
        <TakePicture onClose={() => router.push("/")} setState={setState} />
      </Funnel.Step>
      <Funnel.Step name="form">
        <CreatePostForm state={state} setState={setState} />
      </Funnel.Step>
    </Funnel>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
