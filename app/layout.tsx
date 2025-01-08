import { Providers } from "./providers"
import { NotificationsProvider } from "./contexts/notifications-context"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NotificationsProvider>
            {children}
          </NotificationsProvider>
        </Providers>
      </body>
    </html>
  )
} 