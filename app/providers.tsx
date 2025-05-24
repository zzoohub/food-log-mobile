import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// We could add theme providers, authentication providers, etc. here

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
