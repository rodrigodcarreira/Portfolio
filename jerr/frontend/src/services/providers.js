import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "../context/auth";
import Mantine from "./mantine";

function Providers({ children }) {
  const queryClient = new QueryClient();

  return (
    <Mantine>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Mantine>
  );
}

export default Providers;
