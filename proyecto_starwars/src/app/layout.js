import { WikiProvider } from "./wiki/wikiContext";

export const metadata = {
  title: "Star Wars DB",
  description: "TP Final Star Wars - ORT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, backgroundColor: "#000" }}>
         <WikiProvider>
          {children}
        </WikiProvider>
        </body>
    </html>
  );
}