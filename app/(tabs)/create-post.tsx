import { TakePicture } from "@/domains/post";
import { useFunnel } from "@/lib";
import { useRouter } from "expo-router";
import { Text, StyleSheet, SafeAreaView } from "react-native";

type Steps = ["take-photo", "form"];
interface CreatePostParams extends Record<string, unknown> {
  title: string;
  images: string[];
}
export default function CreatePostPage() {
  const [Funnel, state, setState] = useFunnel<Steps, CreatePostParams>(["take-photo", "form"]).withState({
    title: "",
    images: [],
  });

  const router = useRouter();

  return (
    <Funnel>
      <Funnel.Step name="take-photo">
        <TakePicture onClose={() => router.push("/")} />
      </Funnel.Step>
      <Funnel.Step name="form">
        <Text>form</Text>
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
