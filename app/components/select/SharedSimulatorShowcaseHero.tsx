"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import PickerShell from "./PickerShell";
import FilterButton from "./FilterButton";
import FilterGroup from "./FilterGroup";
import OperatorSelectCard from "./OperatorSelectCard";
import WeaponSelectCard from "./WeaponSelectCard";
import GearSelectCard from "./GearSelectCard";

import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import { gearDetails } from "@/data/gear-detail-data";

const elementLabelMap: Record<string, string> = {
  physical: "물리",
  cryo: "냉기",
  heat: "열기",
  nature: "자연",
  electric: "전기",
};

const classLabelMap: Record<string, string> = {
  vanguard: "뱅가드",
  guard: "가드",
  defender: "디펜더",
  supporter: "서포터",
  caster: "캐스터",
  striker: "스트라이커",
  medic: "메딕",
};

const gearCategoryLabelMap: Record<string, string> = {
  armor: "방어구",
  gloves: "보호 장갑",
  kit: "부품",
};

export default function SharedSimulatorShowcaseHero({
  mode,
}: {
  mode: "simulator" | "settings";
}) {
  const [tab, setTab] = useState<"operator" | "weapon" | "gear">("operator");

  const [search, setSearch] = useState("");

  const [elementFilter, setElementFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");

  const [weaponTypeFilter, setWeaponTypeFilter] = useState("all");

  const [gearCategoryFilter, setGearCategoryFilter] = useState("all");

  const filteredOperators = useMemo(() => {
    const q = search.trim().toLowerCase();

    return operatorDetails.filter((item: any) => {
      const keyword =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q);

      const element =
        elementFilter === "all" || item.element === elementFilter;

      const classOk =
        classFilter === "all" || item.class === classFilter;

      return keyword && element && classOk;
    });
  }, [search, elementFilter, classFilter]);

  const filteredWeapons = useMemo(() => {
    const q = search.trim().toLowerCase();

    return weaponDetails.filter((item: any) => {
      const keyword =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q);

      const type =
        weaponTypeFilter === "all" ||
        item.weaponType === weaponTypeFilter ||
        item.type === weaponTypeFilter;

      return keyword && type;
    });
  }, [search, weaponTypeFilter]);

  const filteredGear = useMemo(() => {
    const q = search.trim().toLowerCase();

    return gearDetails.filter((item: any) => {
      const keyword =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q);

      const category =
        gearCategoryFilter === "all" ||
        item.category === gearCategoryFilter;

      return keyword && category;
    });
  }, [search, gearCategoryFilter]);

  const weaponTypes = useMemo(() => {
    return Array.from(
      new Set(
        weaponDetails.map((item: any) => item.weaponType ?? item.type),
      ),
    ).filter(Boolean);
  }, []);

  const count =
    tab === "operator"
      ? filteredOperators.length
      : tab === "weapon"
        ? filteredWeapons.length
        : filteredGear.length;

  return (
    <PickerShell
      title={
        mode === "settings"
          ? "SETTINGS SELECT"
          : "SIMULATOR SELECT"
      }
      count={count}
      searchValue={search}
      searchPlaceholder="이름 / 타입 검색"
      onSearch={setSearch}
      onClose={() => {}}
      aside={
        <>
          <FilterGroup title="카테고리">
            <FilterButton
              active={tab === "operator"}
              label="오퍼레이터"
              onClick={() => setTab("operator")}
            />

            <FilterButton
              active={tab === "weapon"}
              label="무기"
              onClick={() => setTab("weapon")}
            />

            <FilterButton
              active={tab === "gear"}
              label="장비"
              onClick={() => setTab("gear")}
            />
          </FilterGroup>

          {tab === "operator" ? (
            <>
              <FilterGroup title="속성">
                <FilterButton
                  active={elementFilter === "all"}
                  label="전체"
                  onClick={() => setElementFilter("all")}
                />

                {Object.entries(elementLabelMap).map(([key, label]) => (
                  <FilterButton
                    key={key}
                    active={elementFilter === key}
                    label={label}
                    onClick={() => setElementFilter(key)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="클래스">
                <FilterButton
                  active={classFilter === "all"}
                  label="전체"
                  onClick={() => setClassFilter("all")}
                />

                {Object.entries(classLabelMap).map(([key, label]) => (
                  <FilterButton
                    key={key}
                    active={classFilter === key}
                    label={label}
                    onClick={() => setClassFilter(key)}
                  />
                ))}
              </FilterGroup>
            </>
          ) : null}

          {tab === "weapon" ? (
            <FilterGroup title="무기 타입">
              <FilterButton
                active={weaponTypeFilter === "all"}
                label="전체"
                onClick={() => setWeaponTypeFilter("all")}
              />

              {weaponTypes.map((type) => (
                <FilterButton
                  key={type}
                  active={weaponTypeFilter === type}
                  label={type}
                  onClick={() => setWeaponTypeFilter(type)}
                />
              ))}
            </FilterGroup>
          ) : null}

          {tab === "gear" ? (
            <FilterGroup title="장비 유형">
              <FilterButton
                active={gearCategoryFilter === "all"}
                label="전체"
                onClick={() => setGearCategoryFilter("all")}
              />

              {Object.entries(gearCategoryLabelMap).map(
                ([key, label]) => (
                  <FilterButton
                    key={key}
                    active={gearCategoryFilter === key}
                    label={label}
                    onClick={() => setGearCategoryFilter(key)}
                  />
                ),
              )}
            </FilterGroup>
          ) : null}
        </>
      }
    >
      {tab === "operator" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
          {filteredOperators.map((item: any) => (
            <OperatorSelectCard
              key={item.slug}
              operator={item}
              active={false}
              onClick={() => {}}
            />
          ))}
        </div>
      ) : null}

      {tab === "weapon" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
          {filteredWeapons.map((item: any) => (
            <WeaponSelectCard
              key={item.slug}
              weapon={item}
              active={false}
              onClick={() => {}}
            />
          ))}
        </div>
      ) : null}

      {tab === "gear" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
          {filteredGear.map((item: any) => (
            <GearSelectCard
              key={item.slug}
              gear={item}
              active={false}
              onClick={() => {}}
            />
          ))}
        </div>
      ) : null}
    </PickerShell>
  );
}