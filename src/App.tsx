import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Route, Routes } from "react-router-dom";
import Budgets from "./pages/budgets";
import Products from "./pages/products";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Routes>
        <Route path="/" element={<Budgets />} />
        <Route path="/products" element={<Products />} />
        <Route path="/budgets" element={<Budgets />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}
