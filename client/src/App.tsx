import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Inquiry from "./pages/Inquiry";
import ArticlePage from "./pages/Article";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Rodo from "./pages/Rodo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/oferta" component={Catalog} />
      <Route path="/produkt/:slug" component={ProductDetail} />
      <Route path="/zapytanie" component={Inquiry} />
      <Route path="/optyka">{() => <ArticlePage section="optyka" />}</Route>
      <Route path="/nowosc">{() => <ArticlePage section="nowosc" />}</Route>
      <Route path="/oprogramowanie">{() => <ArticlePage section="oprogramowanie" />}</Route>
      <Route path="/technologia/:slug">{() => <ArticlePage section="technologia" />}</Route>
      <Route path="/technologia">{() => <ArticlePage section="technologia" />}</Route>
      <Route path="/kontakt" component={Contact} />
      <Route path="/polityka-prywatnosci" component={Privacy} />
      <Route path="/klauzula-rodo" component={Rodo} />
      <Route path="/admin/login" component={Login} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
