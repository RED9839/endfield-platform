import { signIn, signOut } from "@/auth";

export function GoogleSignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#ffd24a] px-5 py-3 text-sm font-black text-black transition hover:brightness-110"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-black text-black">
          G
        </span>
        Google 계정으로 시작하기
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="min-h-11 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300"
      >
        로그아웃
      </button>
    </form>
  );
}
