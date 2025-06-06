import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function SimpleHome() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Brown Feed Store</h1>
      <p>Your Local Agricultural Supply in Lampasas, TX</p>
      <div style={{ marginTop: '20px' }}>
        <h2>Store Information</h2>
        <p>Address: 123 Main Street, Lampasas, TX 76550</p>
        <p>Phone: (512) 556-3467</p>
        <p>Email: info@brownfeedstore.com</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>About Us</h2>
        <p>Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers and ranchers throughout Central Texas.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleHome />
    </QueryClientProvider>
  );
}

export default App;