import { GeometricPanel } from '@/components/auth/geometric-panel';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <GeometricPanel />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}
