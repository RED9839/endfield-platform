import { NextResponse } from "next/server";

import { buildSettingsEditorDataPayload } from "@/lib/settings/editor-data";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(buildSettingsEditorDataPayload());
}
