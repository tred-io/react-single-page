import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import AdminEnhanced from "./pages/AdminEnhanced";
import ThemeGeneratorPage from "./pages/ThemeGeneratorPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminEnhanced} />
      <Route path="/themes" component={ThemeGeneratorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
