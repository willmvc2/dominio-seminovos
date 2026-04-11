import "./globals.css";
import Menu from "../components/Menu";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={poppins.className} style={{ background: "#0f172a" }}>
        
        {/* MENU GLOBAL */}
        <Menu />

        {/* CONTEÚDO DAS PÁGINAS */}
        {children}

      </body>
    </html>
  );
}