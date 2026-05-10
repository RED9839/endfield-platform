import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      type,
      title,
      description,
      nickname,
      slots,
    } = body;

    if (!slots?.length) {
      return NextResponse.json(
        { error: "슬롯 데이터가 없습니다." },
        { status: 400 },
      );
    }

    const mainSlot = slots.find((slot: any) => slot.slotKey === "main");

    if (!mainSlot) {
      return NextResponse.json(
        { error: "메인 오퍼레이터가 필요합니다." },
        { status: 400 },
      );
    }

    const { data: setting, error: settingError } = await supabaseAdmin
      .from("settings")
      .insert({
        type,
        title,
        description,
        nickname,
        main_operator_slug: mainSlot.operatorSlug,
        main_weapon_slug: mainSlot.weaponSlug,
      })
      .select()
      .single();

    if (settingError || !setting) {
      return NextResponse.json(
        {
          error: settingError?.message ?? "settings 저장 실패",
        },
        { status: 500 },
      );
    }

    const slotRows = slots.map((slot: any) => ({
      setting_id: setting.id,
      slot_key: slot.slotKey,

      operator_slug: slot.operatorSlug,
      weapon_slug: slot.weaponSlug,

      armor_slug: slot.armorSlug,
      gloves_slug: slot.glovesSlug,
      kit1_slug: slot.kit1Slug,
      kit2_slug: slot.kit2Slug,

      form_json: slot.formJson,
    }));

    const { error: slotError } = await supabaseAdmin
      .from("setting_slots")
      .insert(slotRows);

    if (slotError) {
      return NextResponse.json(
        {
          error: slotError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      settingId: setting.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    );
  }
}
