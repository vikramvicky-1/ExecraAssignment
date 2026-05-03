import { Playfair_Display, DM_Sans, DM_Mono, Manrope, Syncopate } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700", "900"], style: ["normal", "italic"], variable: "--font-playfair" })
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-dm-sans" })
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-mono" })
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--manrope-font" })
const syncopate = Syncopate({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-syncopate" })

export const metadata = {
  title: "Vikram — Full Stack Engineer",
  description: "Full Stack Engineer specializing in MERN Stack and Next.js. Building scalable applications that matter.",
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

import { Toaster } from "react-hot-toast"

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} ${manrope.variable} ${syncopate.variable} bg-[#FAF8F4]`}>
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  )
}
