import NavbarRight from "@/components/navbar-right"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with NavbarRight component */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">EVENT NOW</h1>
          </div>

          {/* NavbarRight component */}
          <NavbarRight />
        </div>
      </header>

      {/* Page content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Navbar Component Demo</h2>
          <p className="text-gray-600">
            This page demonstrates the NavbarRight component with notification and account dropdowns. Try clicking on
            the notification bell and user profile icon in the top right corner.
          </p>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Features:</h3>
            <ul className="list-disc pl-5 space-y-1 text-blue-700">
              <li>Notification dropdown with unread indicators</li>
              <li>Account dropdown with user profile information</li>
              <li>Responsive design that works on mobile and desktop</li>
              <li>Smooth animations and transitions</li>
              <li>Click outside to close dropdowns</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
