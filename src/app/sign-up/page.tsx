import SignUpForm from "@/components/auth-form/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="p-10 flex flex-col items-center gap-5 justify-start w-full">
      <h1 className="text-3xl font-semibold">회원가입</h1>
      <SignUpForm className="w-full max-w-sm" />
    </div>
  );
}
