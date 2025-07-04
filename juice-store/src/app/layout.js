import { Outfit } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
  title: "Organic Things",
  description: "Premium organic juices for your wellness journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
