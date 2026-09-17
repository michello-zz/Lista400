import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Lista 400 - Gestión de Votantes",
  description: "Sistema de gestión de votantes y actividades de la Lista 400",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
