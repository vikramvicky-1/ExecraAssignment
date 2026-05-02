import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700", "900"], style: ["normal", "italic"], variable: "--font-playfair" })
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-dm-sans" })
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-mono" })

export const metadata = {
  title: "Vikram — Full Stack Engineer",
  description: "Full Stack Engineer specializing in MERN Stack and Next.js. Building scalable applications that matter.",
}

import { Toaster } from "react-hot-toast"

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} bg-[#FAF8F4]`}>
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  )
}
