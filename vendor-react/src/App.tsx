import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";

function App() {
  const router = createBrowserRouter([PublicRoutes()]);
  console.log(import.meta.env);
  return <RouterProvider router={router} />;
}

export default App;
