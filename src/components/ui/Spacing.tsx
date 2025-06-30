import { View, ViewStyle } from "react-native";

interface SpacingProps {
  size: number;
  horizontal?: boolean;
}

export function Spacing({ size, horizontal = false }: SpacingProps) {
  const style: ViewStyle = horizontal ? { width: size, height: "100%" } : { height: size, width: "100%" };

  return <View style={style} />;
}
