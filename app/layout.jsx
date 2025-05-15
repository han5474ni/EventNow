import "./globals.css"

export const metadata = {
  title: "EVENT NOW",
  description: "Event management platform",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
