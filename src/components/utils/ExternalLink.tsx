import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { openURL } from "expo-linking";

interface ExternalLinkProps extends Omit<TouchableOpacityProps, "onPress"> {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children, ...props }: ExternalLinkProps) {
  return (
    <TouchableOpacity
      {...props}
      onPress={() => {
        openURL(href);
      }}
    >
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
}
