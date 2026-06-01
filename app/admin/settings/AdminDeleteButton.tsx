"use client";

export default function AdminDeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("정말 삭제하시겠습니까?")) {
          e.preventDefault();
        }
      }}
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 hover:bg-red-500/20"
    >
      세팅 삭제
    </button>
  );
}
