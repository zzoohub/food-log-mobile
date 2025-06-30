import { ReactNode } from "react";
import QueryClientProvider from "./QueryClientProvider";

export default function AppProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
