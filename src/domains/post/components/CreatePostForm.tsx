import React from "react";
import { FunnelSetState } from "@/components/utils/funnel/model";
import { Image, SafeAreaView, View, TextInput, Button, Text } from "react-native";
import { CreatePostParams, CreatePostSteps } from "~/app/(tabs)/create-post";

export function CreatePostForm({
  state,
  setState,
}: {
  state: CreatePostParams;
  setState: FunnelSetState<CreatePostSteps, CreatePostParams>;
}) {
  const handleLocationChange = (location: { latitude: number; longitude: number }) => {
    setState(prevState => ({ ...prevState, location }));
  };

  const handlePriceChange = (price: number) => {
    setState(prevState => ({ ...prevState, price }));
  };

  const handleDescriptionChange = (description: string) => {
    setState(prevState => ({ ...prevState, description }));
  };

  const handleRatingChange = (rating: number) => {
    setState(prevState => ({ ...prevState, rating }));
  };

  const handleCaloriesChange = (calories: number) => {
    setState(prevState => ({ ...prevState, calories }));
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Post submitted:", state);
  };

  return (
    <SafeAreaView>
      <View>
        <Button title="나중에 작성하기" />
        <View>
          {state.images.map(image => (
            <Image
              source={{ uri: image }}
              key={image.toString()}
              style={{ width: 100, height: 100, marginBottom: 10 }}
            />
          ))}
        </View>

        <View>
          <Text>Location</Text>
        </View>

        <TextInput
          value={state.price?.toString()}
          onChangeText={text => handlePriceChange(Number(text))}
          keyboardType="number-pad"
          placeholder="Enter price"
          style={{ borderWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          value={state.description}
          onChangeText={handleDescriptionChange}
          placeholder="Enter description"
          style={{ borderWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          value={state.rating?.toString()}
          onChangeText={text => handleRatingChange(Number(text))}
          placeholder="Enter rating"
          style={{ borderWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          value={state.calories?.toString()}
          onChangeText={text => handleCaloriesChange(Number(text))}
          placeholder="Enter calories"
          style={{ borderWidth: 1, marginBottom: 10 }}
        />
        <Button title="저장" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}
