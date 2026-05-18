"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import SettingEditor from "@/app/components/settings/SettingEditor";

const SETTINGS_FORM_STORAGE_KEY = "endfield-operator-setting-form-v1";

type ReadonlySettingEditorProps = {
  form: any;
  partyForms?: any[];
};

export default function ReadonlySettingEditor({
  form,
  partyForms = [],
}: ReadonlySettingEditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  const storageValue = useMemo(() => JSON.stringify(form ?? {}), [form]);

  useEffect(() => {
    const previousValue = window.localStorage.getItem(SETTINGS_FORM_STORAGE_KEY);

    window.localStorage.setItem(SETTINGS_FORM_STORAGE_KEY, storageValue);
    setReady(true);

    return () => {
      if (previousValue === null) {
        window.localStorage.removeItem(SETTINGS_FORM_STORAGE_KEY);
      } else {
        window.localStorage.setItem(SETTINGS_FORM_STORAGE_KEY, previousValue);
      }
    };
  }, [storageValue]);

  function isFinalStatDetailButton(button: HTMLButtonElement) {
    const text = button.textContent?.trim() ?? "";
    const aria = button.getAttribute("aria-label") ?? "";
    const title = button.getAttribute("title") ?? "";

    return (
      text.includes("▼") ||
      text.includes("▲") ||
      aria.includes("최종") ||
      aria.includes("스탯") ||
      title.includes("최종") ||
      title.includes("스탯")
    );
  }

  function blockEditableControls(event: React.SyntheticEvent<HTMLElement>) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const button = target.closest("button") as HTMLButtonElement | null;

    if (button && isFinalStatDetailButton(button)) {
      return;
    }

    const control = target.closest("input, select, textarea, a");
    if (!control) return;

    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    if (!ready || !rootRef.current) return;

    const root = rootRef.current;

    function lockControls() {
      root.querySelectorAll("input, textarea").forEach((element) => {
        const input = element as HTMLInputElement | HTMLTextAreaElement;
        input.readOnly = true;
        input.disabled = true;
        input.tabIndex = -1;
      });

      root.querySelectorAll("select").forEach((element) => {
        const select = element as HTMLSelectElement;
        select.disabled = true;
        select.tabIndex = -1;
      });

      root.querySelectorAll("button").forEach((element) => {
        const button = element as HTMLButtonElement;

        if (isFinalStatDetailButton(button)) {
          button.disabled = false;
          button.tabIndex = 0;
          button.style.display = "";
          button.style.pointerEvents = "auto";
          button.style.cursor = "pointer";
          return;
        }

        const text = button.textContent?.trim() ?? "";

        const shouldHide =
          text.includes("선택") ||
          text.includes("세팅") ||
          text.includes("해제") ||
          text.includes("초기화") ||
          text.includes("저장") ||
          text.includes("적용") ||
          text.includes("닫기");

        if (shouldHide) {
          button.style.display = "none";
          return;
        }

        button.disabled = true;
        button.tabIndex = -1;
        button.style.pointerEvents = "none";
      });

      root.querySelectorAll("a").forEach((element) => {
        const link = element as HTMLAnchorElement;
        link.style.pointerEvents = "none";
        link.tabIndex = -1;
      });
    }

    lockControls();

    const observer = new MutationObserver(lockControls);
    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [ready, storageValue]);

  if (!ready) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[24px] border border-white/10 bg-[#05070b] text-sm font-bold text-zinc-500">
        세팅 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div ref={rootRef} className="readonly-setting-editor">
      <style jsx global>{`
        .readonly-setting-editor select,
        .readonly-setting-editor input,
        .readonly-setting-editor textarea {
          pointer-events: none !important;
          cursor: default !important;
          opacity: 1 !important;
        }

        .readonly-setting-editor select {
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: none !important;
        }

        .readonly-setting-editor button,
        .readonly-setting-editor a {
          cursor: default !important;
        }

        .readonly-setting-editor button[disabled] {
          opacity: 1 !important;
        }
      `}</style>

      <div
        onClickCapture={blockEditableControls}
        onChangeCapture={blockEditableControls}
      >
        <SettingEditor key={storageValue} partyForms={partyForms} />
      </div>
    </div>
  );
}
