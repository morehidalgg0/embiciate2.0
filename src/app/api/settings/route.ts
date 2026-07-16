import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionAdminId } from "@/lib/auth";
import { defaultSiteSettings, getSiteSettings } from "@/lib/site-settings";

export async function GET() {
  try {
    return NextResponse.json(await getSiteSettings());
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json(
        { error: "No autorizado. Iniciá sesión." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = {
      heroBadge: String(body.heroBadge || defaultSiteSettings.heroBadge),
      heroTitleLine1: String(body.heroTitleLine1 || defaultSiteSettings.heroTitleLine1),
      heroTitleHighlight: String(body.heroTitleHighlight || defaultSiteSettings.heroTitleHighlight),
      heroTitleLine3: String(body.heroTitleLine3 || defaultSiteSettings.heroTitleLine3),
      heroDescription: String(body.heroDescription || defaultSiteSettings.heroDescription),
      heroImageUrl: String(body.heroImageUrl || ""),
      heroPrimaryCta: String(body.heroPrimaryCta || defaultSiteSettings.heroPrimaryCta),
      heroSecondaryCta: String(body.heroSecondaryCta || defaultSiteSettings.heroSecondaryCta),
    };

    const settings = await prisma.siteSettings.upsert({
      where: { id: "site" },
      create: { id: "site", ...data },
      update: data,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
