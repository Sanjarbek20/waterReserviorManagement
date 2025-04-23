import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";

// Import pages
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/AdminPanel";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/" component={HomePage} />
        </Switch>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;