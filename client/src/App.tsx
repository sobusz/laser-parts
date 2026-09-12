import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./i18n/locale";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import UsedMachine from "./pages/UsedMachine";
import Inquiry from "./pages/Inquiry";
import ArticlePage from "./pages/Article";
import HowToOrder from "./pages/HowToOrder";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Rodo from "./pages/Rodo";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/oferta" component={Catalog} />
      <Route path="/produkt/:slug" component={ProductDetail} />
      <Route path="/maszyna/:slug" component={UsedMachine} />
      <Route path="/zapytanie" component={Inquiry} />
      <Route path="/jak-zamawiac" component={HowToOrder} />
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
  const base = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;
  return (
    <Router base={base}>
      <ErrorBoundary>
        <LocaleProvider>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster richColors position="top-right" />
              <AppRoutes />
            </TooltipProvider>
          </ThemeProvider>
        </LocaleProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
