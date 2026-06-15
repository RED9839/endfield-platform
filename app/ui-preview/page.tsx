"use client";

import { Inbox, Shield, Sword, Users } from "lucide-react";
import { useState } from "react";

import {
  EndfieldBadge,
  EndfieldButton,
  EndfieldDrawer,
  EndfieldEmptyState,
  EndfieldFilterBar,
  EndfieldGrid,
  EndfieldLoading,
  EndfieldModal,
  EndfieldPanel,
  EndfieldSearch,
  EndfieldStatsCard,
  EndfieldTabs,
  EndfieldTag,
  PageHeader,
  SectionCard,
} from "@/components/ui";

// 디자인 시스템 검증용 쇼케이스(개발/디자인 미리보기).
export default function UiPreviewPage() {
  const [tab, setTab] = useState("operators");
  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-ef-bg px-3 py-4 text-ef-ink sm:px-5 sm:py-6">
      <div className="mx-auto grid max-w-[1100px] gap-4">
        <PageHeader
          eyebrow="DESIGN SYSTEM"
          title="Endfield UI"
          subtitle="공통 디자인 언어 · 산업 디자인 · 모바일 우선"
          backHref="/"
          actions={<EndfieldButton size="sm">액션</EndfieldButton>}
        />

        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <EndfieldStatsCard label="오퍼레이터" value="27" icon={<Users className="h-4 w-4" />} />
          <EndfieldStatsCard label="무기" value="71" icon={<Sword className="h-4 w-4" />} />
          <EndfieldStatsCard label="장비" value="220" icon={<Shield className="h-4 w-4" />} />
          <EndfieldStatsCard label="세팅" value="76" icon={<Inbox className="h-4 w-4" />} />
        </section>

        <EndfieldTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "operators", label: "오퍼레이터", count: 27 },
            { value: "weapons", label: "무기", count: 71 },
            { value: "gear", label: "장비", count: 220 },
            { value: "enemies", label: "적 도감", count: 40 },
            { value: "settings", label: "세팅 공유", count: 76 },
          ]}
        />

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <EndfieldSearch value={keyword} onChange={setKeyword} placeholder="오퍼레이터, 무기, 장비 검색" />
          <EndfieldFilterBar onOpen={() => setDrawerOpen(true)} activeCount={2} />
        </div>

        <SectionCard
          title="버튼 / 배지 / 태그"
          action={<EndfieldBadge tone="accent">SYSTEM</EndfieldBadge>}
        >
          <div className="flex flex-wrap gap-2">
            <EndfieldButton variant="primary">Primary</EndfieldButton>
            <EndfieldButton variant="secondary">Secondary</EndfieldButton>
            <EndfieldButton variant="ghost">Ghost</EndfieldButton>
            <EndfieldButton variant="danger">Danger</EndfieldButton>
            <EndfieldButton size="sm">Small</EndfieldButton>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <EndfieldBadge>Default</EndfieldBadge>
            <EndfieldBadge tone="accent">5★</EndfieldBadge>
            <EndfieldBadge tone="success">추천 +120</EndfieldBadge>
            <EndfieldBadge tone="danger">침식</EndfieldBadge>
            <EndfieldBadge tone="muted">레벨 70</EndfieldBadge>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <EndfieldTag color="#ffd24a">물리</EndfieldTag>
            <EndfieldTag color="#4fa3ff">냉기</EndfieldTag>
            <EndfieldTag color="#ff8a1f">열기</EndfieldTag>
            <EndfieldTag>고검의 잔향</EndfieldTag>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <EndfieldButton variant="secondary" onClick={() => setModalOpen(true)}>
              모달 열기
            </EndfieldButton>
            <EndfieldButton variant="secondary" onClick={() => setDrawerOpen(true)}>
              드로어 열기
            </EndfieldButton>
          </div>
        </SectionCard>

        <SectionCard title="그리드 / 패널">
          <EndfieldGrid min={150}>
            {Array.from({ length: 6 }).map((_, index) => (
              <EndfieldPanel key={index} className="p-3">
                <div className="aspect-[3/4] rounded-lg bg-ef-card2" />
                <p className="mt-2 truncate text-sm font-black text-ef-accent-soft">
                  카드 {index + 1}
                </p>
                <p className="truncate text-[11px] text-ef-muted">Card item</p>
              </EndfieldPanel>
            ))}
          </EndfieldGrid>
        </SectionCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <SectionCard title="빈 상태">
            <EndfieldEmptyState
              icon={<Inbox className="h-8 w-8" />}
              title="등록된 데이터가 없습니다"
              description="조건에 맞는 항목이 없습니다. 필터를 조정해 보세요."
              action={<EndfieldButton size="sm">필터 초기화</EndfieldButton>}
            />
          </SectionCard>
          <SectionCard title="로딩">
            <EndfieldLoading label="불러오는 중..." />
          </SectionCard>
        </div>
      </div>

      <EndfieldModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="모달 (모바일 풀스크린)"
        footer={
          <div className="flex justify-end gap-2">
            <EndfieldButton variant="ghost" onClick={() => setModalOpen(false)}>
              취소
            </EndfieldButton>
            <EndfieldButton onClick={() => setModalOpen(false)}>확인</EndfieldButton>
          </div>
        }
      >
        <p className="text-sm leading-6 text-ef-muted">
          모바일에서는 풀스크린, 데스크톱에서는 중앙 카드로 표시됩니다. ESC 또는 배경
          클릭으로 닫힙니다.
        </p>
      </EndfieldModal>

      <EndfieldDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="필터 (Bottom Sheet)"
        footer={
          <EndfieldButton block onClick={() => setDrawerOpen(false)}>
            적용
          </EndfieldButton>
        }
      >
        <div className="grid gap-2">
          {["전체", "방어구", "보호 장갑", "부품"].map((label) => (
            <EndfieldButton key={label} variant="secondary" block>
              {label}
            </EndfieldButton>
          ))}
        </div>
      </EndfieldDrawer>
    </main>
  );
}
