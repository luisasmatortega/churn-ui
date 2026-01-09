import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-100">
        {children}
      </body>
    </html>
  );
}