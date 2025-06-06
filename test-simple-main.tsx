import { createRoot } from "react-dom/client";

function SimpleApp() {
  return <div>TEST: React App is working!</div>;
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<SimpleApp />);
} else {
  console.error("Root element not found");
}