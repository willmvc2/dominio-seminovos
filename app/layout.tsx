import "./globals.css";
import Menu from "../components/Menu";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata = {
  title: "Carros seminovos em São Paulo | Sua Loja",
  description:
    "Encontre carros seminovos em São Paulo. Veículos revisados, com procedência e ótimas condições de pagamento.",
};

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