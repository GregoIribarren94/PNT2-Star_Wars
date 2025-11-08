import "./globals.css";
import AuthProvider from "./contexts/AuthProvider";
import { WikiProvider } from "./wiki/wikiContext";

export const metadata = {
  title: "Star Wars DB",
  description: "TP Final Star Wars - ORT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, backgroundColor: "#000" }}>
        {/* ✅ Proveedores globales para toda la app */}
        <AuthProvider>
          <WikiProvider>
            {children}
          </WikiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
