import { SigninForm } from '@/components/auth/signin-form';

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
          {/* Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
            radial-gradient(circle 600px at 0% 200px, #bfdbfe, transparent),
            radial-gradient(circle 600px at 100% 200px, #bfdbfe, transparent)
          `,
            }}
          />
          {/* Nội dung */}
          <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
            <SigninForm className="scale-75" />
          </div>
        </div>
  )
}

export default SignInPage; 
