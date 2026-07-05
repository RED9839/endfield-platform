import { redirect } from "next/navigation";

// DD 던전 원정이 메인 게임(/game)으로 승격됨 — 옛 경로는 리다이렉트.
export default function DDRedirect() {
  redirect("/game");
}
