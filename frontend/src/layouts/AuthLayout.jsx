import propertyImage from '../assets/images/auth-property.jpg'

const PropertyImage = () => (
  <div className="hidden lg:block">
    <img
      src={propertyImage}
      alt="Luxury living room"
      className="h-full w-full object-cover"
    />
  </div>
)

const AuthLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-canvas">
    <main className="flex w-full flex-1 flex-col">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        <PropertyImage />
        <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </div>
      </div>
    </main>
  </div>
)

export default AuthLayout