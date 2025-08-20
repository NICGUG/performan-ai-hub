import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Puestos from "./pages/Puestos";
import GeneradorDescripciones from "./pages/GeneradorDescripciones";
import Analiticas from "./pages/Analiticas";
import Calendario from "./pages/Calendario";
import Chat from "./pages/Chat";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="puestos" element={<Puestos />} />
            <Route path="generador" element={<GeneradorDescripciones />} />
            <Route path="analiticas" element={<Analiticas />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="chat" element={<Chat />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
