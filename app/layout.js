import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import "./globals.css";

export const metadata = {
  title: "Chess Game - Chơi cờ vua online",
  description: "Chơi cờ vua với bạn bè hoặc AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
