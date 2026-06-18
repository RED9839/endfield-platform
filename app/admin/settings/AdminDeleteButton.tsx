"use client";

const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function AdminDeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("정말 삭제하시겠습니까?")) {
          e.preventDefault();
        }
      }}
      className="border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500/20"
      style={CUT_SM}
    >
      세팅 삭제
    </button>
  );
}
