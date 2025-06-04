import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Home from "./pages/Home";
import AdminEnhanced from "./pages/AdminEnhanced";
import ThemeGeneratorPage from "./pages/ThemeGeneratorPage";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminEnhanced} />
        <Route path="/themes" component={ThemeGeneratorPage} />
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
