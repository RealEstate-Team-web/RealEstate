import { useTranslation } from 'react-i18next'
import AuthLayout from '../../hooks/layouts/AuthLayout';
import LoginForm from '../../components/forms/LoginForm';

export const Login = () => {
  const { t } = useTranslation('auth')

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[420px] rounded-[6px] border border-[#D9E0E2] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-[30px] font-bold leading-[1.1] text-navy">
            {t('login_title')}
          </h1>
          <p className="mt-2 text-[14px] text-ink">
            {t('login_subtitle')}
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default Login;
