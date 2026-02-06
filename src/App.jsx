import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      {/* Toast popup container (global) */}
      <Toaster position="top-right" />

      {/* App routes */}
      <AppRoutes />
    </>
  );
}
