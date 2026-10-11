import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jost";
import "@fontsource/allura/400.css";
import "./globals.css";
import { Analytics } from "@/components/analytics/Analytics";
import { ChatLoader } from "@/components/chat/ChatLoader";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { company } from "@/config/company";
import { siteConfig } from "@/config/site";
import { defaultLocale, localeDirection, localeHtmlLang } from "@/i18n/config";
import { t } from "@/i18n";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${company.name} — Transport en autocar au Maroc`,
    template: `%s | ${company.name}`,
  },
  description:
    "Carla Tamassint Transport : voyagez en autocar entre les villes du Maroc en toute confiance. Trajets, agences, réservation en ligne via Markoub.ma et formation des conducteurs.",
  applicationName: company.name,
  formatDetection: { telephone: false },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={localeHtmlLang[defaultLocale]} dir={localeDirection[defaultLocale]} data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">
        <a
          href="#contenu"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-white px-5 py-3 font-medium text-ink-900 shadow-lg transition-transform focus:translate-y-0"
        >
          {t.common.skipToContent}
        </a>
        <MotionProvider>
          <Header />
          <main id="contenu" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <ChatLoader />
        </MotionProvider>
        <Analytics />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
