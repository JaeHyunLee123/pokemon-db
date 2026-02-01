import LoginForm from "@/components/auth-form/LoginForm";

export default function LoginPage() {
  return (
    <div className="p-10 flex flex-col items-center gap-5 justify-start w-full">
      <h1 className="text-3xl font-semibold">로그인</h1>
      <LoginForm className="w-full max-w-sm" />
    </div>
  );
}
