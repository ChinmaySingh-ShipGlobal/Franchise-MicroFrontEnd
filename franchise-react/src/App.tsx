import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoutes from "@/routes/PrivateRoutes";
import PublicRoutes from "@/routes/PublicRoutes";

function App() {
  const router = createBrowserRouter([PrivateRoutes(), PublicRoutes()]);
  console.log(import.meta.env);
  return <RouterProvider router={router} />;
}

export default App;
