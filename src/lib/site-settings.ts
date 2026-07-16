import { prisma } from "@/lib/db";

export const defaultSiteSettings = {
  id: "site",
  heroBadge: "EL SHOWROOM N°1 DE MDP",
  heroTitleLine1: "LA BICI",
  heroTitleHighlight: "QUE BUSCÁS",
  heroTitleLine3: "ESTÁ ACÁ",
  heroDescription:
    "Las mejores marcas, los mejores precios y la asesoría que necesitás para pedalear seguro. Encontranos en nuestros locales físicos en Mar del Plata.",
  heroImageUrl: "",
  heroPrimaryCta: "ESCRIBINOS POR WHATSAPP",
  heroSecondaryCta: "VER BICICLETAS",
};

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "site" },
  });

  return settings || defaultSiteSettings;
}
