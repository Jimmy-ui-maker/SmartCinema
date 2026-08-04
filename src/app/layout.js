import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import BootstrapClient from "@/components/BootstrapClient";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  manifest: "/manifest.json",

  title: "Cinema Ticketing System",

  description:
    "A modern web-based Cinema Ticketing System for online movie booking and seat reservation.",

  keywords: [
    "Cinema",
    "Movie",
    "Ticket Booking",
    "Next.js",
    "Bootstrap",
    "MongoDB",
    "Cloudinary",
  ],

  authors: [
    {
      name: "Sir Jimmy",
    },
  ],

  openGraph: {
    title: "Cinema Ticketing System",

    description:
      "Book movies online, reserve seats, and manage cinema operations.",

    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <BootstrapClient />

          <main>
            <Navbar />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
