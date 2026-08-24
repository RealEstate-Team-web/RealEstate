import AuthLayout from '../../hooks/layouts/AuthLayout'
import RegisterForm from '../../components/forms/RegisterForm'

const RegisterAgent = () => {
  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[420px] rounded-[6px] border border-[#D9E0E2] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="mb-7 text-center">
          <h1 className="font-display text-[30px] font-bold leading-[1.1] text-navy">
            Become an Agent
          </h1>
          <p className="mt-2 text-[14px] text-ink">
            Sign up to list properties with Dream Home Estates.
          </p>
        </div>
        <RegisterForm initialRole="agent" />
      </div>
    </AuthLayout>
  )
}

export default RegisterAgent