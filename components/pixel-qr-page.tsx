import { ScrollView, Text, View } from "react-native";
import { AppHeader } from "@/components/app-header";
import { FeatureCard } from "@/components/feature-card";
import { HeroSection } from "@/components/hero-section";
import { QRGenerator } from "@/components/qr-generator";
import { TemplateCard } from "@/components/template-card";
import { Button, SectionShell } from "@/components/ui";
import { colors } from "@/constants/theme";
import { scrollToSection } from "@/utils/scroll-to-section";

const templates = [
  {
    id: "business",
    title: "Business QR",
    subtitle: "Contact cards, portfolios, and sales collateral.",
    category: "Business",
    accent: "#111827",
    surface: "#f3f4f6",
    payload: "BEGIN:VCARD\nFN:Alex Morgan\nEND:VCARD",
    format: "vCard profile",
    bestFor: "Business cards, portfolio pages, and sales leave-behinds.",
    fields: ["Name", "Role", "Phone", "Email", "Website"],
    visualStyle: "business-card"
  },
  {
    id: "restaurant",
    title: "Restaurant Menu QR",
    subtitle: "Menu access for tables, takeout, and signage.",
    category: "Hospitality",
    accent: "#0f766e",
    surface: "#ecfdf5",
    payload: "https://menu.pixelqr.app",
    format: "Digital menu",
    bestFor: "Table tents, takeaway cards, counter signage, and food posters.",
    fields: ["Header logo", "Menu link", "Table label", "CTA"],
    visualStyle: "menu-poster"
  },
  {
    id: "instagram",
    title: "Instagram QR",
    subtitle: "Turn printed surfaces into social follows.",
    category: "Creator",
    accent: "#db2777",
    surface: "#fdf2f8",
    payload: "https://instagram.com/pixelqr",
    format: "Social follow",
    bestFor: "Creator packaging, pop-up booths, events, and merch.",
    fields: ["Handle", "Profile link", "Creator name", "CTA"],
    visualStyle: "social-card"
  },
  {
    id: "whatsapp",
    title: "WhatsApp QR",
    subtitle: "Fast support, sales, and booking conversations.",
    category: "Support",
    accent: "#059669",
    surface: "#ecfdf5",
    payload: "https://wa.me/15551234567",
    format: "Chat link",
    bestFor: "Support desks, booking counters, service teams, and sales.",
    fields: ["Phone", "Message", "Team name", "CTA"],
    visualStyle: "chat-card"
  },
  {
    id: "wifi",
    title: "Wi-Fi QR",
    subtitle: "Guest network access without spelling passwords.",
    category: "Venue",
    accent: "#2563eb",
    surface: "#eff6ff",
    payload: "WIFI:T:WPA;S:PixelQR Guest;P:scanbeautiful;;",
    format: "Guest network",
    bestFor: "Hotels, cafes, offices, rentals, and reception areas.",
    fields: ["SSID", "Password", "Encryption", "Venue"],
    visualStyle: "wifi-card"
  },
  {
    id: "payment",
    title: "Payment QR",
    subtitle: "UPI and payment destination templates.",
    category: "Payment",
    accent: "#7c3aed",
    surface: "#f5f3ff",
    payload: "upi://pay?pa=pixelqr@bank",
    format: "Payment standee",
    bestFor: "Counters, invoices, stalls, checkout desks, and table payments.",
    fields: ["UPI ID", "Amount", "Merchant", "Pay apps"],
    visualStyle: "payment-standee"
  },
  {
    id: "event",
    title: "Event QR",
    subtitle: "RSVP, maps, ticketing, and agenda links.",
    category: "Event",
    accent: "#0891b2",
    surface: "#ecfeff",
    payload: "https://events.pixelqr.app/summit",
    format: "Event access",
    bestFor: "Invites, venue posters, badges, agendas, and RSVP flows.",
    fields: ["RSVP link", "Map", "Date", "Agenda"],
    visualStyle: "event-pass"
  },
  {
    id: "app",
    title: "App Download QR",
    subtitle: "Deep links and store download campaigns.",
    category: "App",
    accent: "#1d4ed8",
    surface: "#eff6ff",
    payload: "pixelqr://download",
    format: "App install",
    bestFor: "Storefronts, product inserts, ads, and onboarding campaigns.",
    fields: ["Deep link", "iOS", "Android", "CTA"],
    visualStyle: "app-card"
  },
  {
    id: "maps",
    title: "Maps QR",
    subtitle: "Store locations, directions, and venue pins.",
    category: "Maps",
    accent: "#047857",
    surface: "#ecfdf5",
    payload: "https://maps.google.com/?q=PixelQR+Studio",
    format: "Maps location",
    bestFor: "Storefronts, event venues, service areas, and directories.",
    fields: ["Map pin", "Address", "Directions", "Hours"],
    visualStyle: "map-card"
  },
  {
    id: "logoHeader",
    title: "Header Logo QR",
    subtitle: "Brand-led QR cards for packaging and posters.",
    category: "Logo",
    accent: "#be123c",
    surface: "#fff1f2",
    payload: "https://pixelqr.app/brand",
    format: "Branded header",
    bestFor: "Premium posters, labels, package inserts, and brand cards.",
    fields: ["Header logo", "Brand name", "CTA", "Website"],
    visualStyle: "brand-header"
  },
  {
    id: "landing",
    title: "Landing Page QR",
    subtitle: "Campaign pages, lead forms, and launch offers.",
    category: "Campaign",
    accent: "#c2410c",
    surface: "#fff7ed",
    payload: "https://pixelqr.app/summer",
    format: "Campaign page",
    bestFor: "Launches, offers, lead forms, ads, and seasonal promos.",
    fields: ["Landing link", "Offer", "UTM tag", "CTA"],
    visualStyle: "campaign-poster"
  },
  {
    id: "coupon",
    title: "Coupon QR",
    subtitle: "Discount codes for receipts, flyers, and shelves.",
    category: "Retail",
    accent: "#ca8a04",
    surface: "#fefce8",
    payload: "SAVE20",
    format: "Coupon code",
    bestFor: "Receipts, flyers, shelf talkers, and retail promo cards.",
    fields: ["Code", "Discount", "Expiry", "Terms"],
    visualStyle: "coupon-ticket"
  },
  {
    id: "review",
    title: "Review QR",
    subtitle: "Collect Google reviews and post-visit feedback.",
    category: "Feedback",
    accent: "#9333ea",
    surface: "#faf5ff",
    payload: "https://pixelqr.app/review",
    format: "Review collector",
    bestFor: "Google review cards, counters, tables, and post-service prompts.",
    fields: ["Google link", "Logo", "Rating CTA", "Branch"],
    visualStyle: "review-standee"
  },
  {
    id: "email",
    title: "Email QR",
    subtitle: "Pre-filled inquiries for quotes, support, and sales.",
    category: "Contact",
    accent: "#4338ca",
    surface: "#eef2ff",
    payload: "mailto:hello@pixelqr.app?subject=New%20inquiry",
    format: "Pre-filled email",
    bestFor: "Quote requests, supplier forms, sales decks, and support cards.",
    fields: ["Email", "Subject", "Message", "Team"],
    visualStyle: "email-card"
  },
  {
    id: "phone",
    title: "Call QR",
    subtitle: "One-tap calling for service desks and bookings.",
    category: "Contact",
    accent: "#0e7490",
    surface: "#ecfeff",
    payload: "tel:+15551234567",
    format: "Tap-to-call",
    bestFor: "Bookings, service desks, emergency contacts, and local ads.",
    fields: ["Phone", "Country code", "Hours", "CTA"],
    visualStyle: "call-card"
  },
  {
    id: "product",
    title: "Product Info QR",
    subtitle: "Manuals, warranty pages, and product details.",
    category: "Product",
    accent: "#334155",
    surface: "#f8fafc",
    payload: "https://pixelqr.app/products/starter-kit",
    format: "Product support",
    bestFor: "Packaging, warranty cards, manuals, setup guides, and labels.",
    fields: ["SKU", "Manual", "Warranty", "Support"],
    visualStyle: "product-label"
  }
] as const;

const features = [
  ["Real-time QR preview", "Every change updates the preview immediately so teams can design without switching tools."],
  ["Brand color customization", "Use calm defaults, precise hex colors, gradients, and reusable presets."],
  ["Logo support", "Add a square brand mark with sizing guidance to protect the QR matrix."],
  ["Scan-safe validation", "Contrast, logo size, and quiet-zone checks help keep finished codes reliable."],
  ["PNG/SVG export", "Export clean assets for campaigns, signage, documents, and social posts."],
  ["Web, Android, and iOS", "Built with Expo so the same product experience travels across platforms."]
] as const;

const exports = ["PNG", "SVG", "Transparent PNG", "Branded card export", "Poster/card layout export"];

export function PixelQRPage() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 24 }}>
      <AppHeader />
      <HeroSection />
      <QRGenerator />
      <TemplatesSection />
      <FeaturesSection />
      <ExportSection />
      <Footer />
    </ScrollView>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <View style={{ gap: 10, maxWidth: 760 }}>
      <Text selectable style={{ color: colors.primaryDark, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>
        {eyebrow}
      </Text>
      <Text selectable style={{ color: colors.text, fontSize: 38, lineHeight: 44, fontWeight: "900" }}>
        {title}
      </Text>
      <Text selectable style={{ color: colors.textMuted, fontSize: 17, lineHeight: 26 }}>
        {body}
      </Text>
    </View>
  );
}

function TemplatesSection() {
  return (
    <SectionShell id="templates" style={{ backgroundColor: colors.surface, paddingVertical: 84 }}>
      <View style={{ gap: 32 }}>
        <SectionHeading
          eyebrow="Templates"
          title="Start from practical QR presets."
          body="Polished templates for the most common business, creator, hospitality, and campaign workflows."
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {templates.map((template) => (
            <TemplateCard key={template.id} {...template} />
          ))}
        </View>
      </View>
    </SectionShell>
  );
}

function FeaturesSection() {
  return (
    <SectionShell id="features" style={{ backgroundColor: colors.background, paddingVertical: 84 }}>
      <View style={{ gap: 32 }}>
        <SectionHeading
          eyebrow="Features"
          title="Designed for production QR workflows."
          body="PixelQR keeps the interface focused while still covering the details teams expect from a serious QR design tool."
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 26 }}>
          {features.map(([title, body]) => (
            <FeatureCard key={title} title={title} body={body} />
          ))}
        </View>
      </View>
    </SectionShell>
  );
}

function ExportSection() {
  return (
    <SectionShell id="export" style={{ backgroundColor: colors.surface, paddingVertical: 84 }}>
      <View style={{ gap: 26 }}>
        <SectionHeading
          eyebrow="Export"
          title="Ship QR assets wherever your team needs them."
          body="Download production-ready QR files, share payloads, and prepare branded layouts for posters, menus, cards, or digital campaigns."
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {exports.map((item) => (
            <View key={item} style={{ borderWidth: 1.25, borderColor: colors.border, backgroundColor: "#f8fafd", borderRadius: 999, paddingHorizontal: 16, minHeight: 42, justifyContent: "center" }}>
              <Text selectable style={{ color: colors.text, fontWeight: "800", fontSize: 13 }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Button label="Create an export-ready QR" onPress={() => scrollToSection("generator")} />
        </View>
      </View>
    </SectionShell>
  );
}

function Footer() {
  const links = ["Privacy", "Terms", "GitHub", "Contact"];
  return (
    <SectionShell style={{ backgroundColor: "#0b1220", paddingVertical: 34 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
        <View style={{ gap: 6 }}>
          <Text selectable style={{ color: "#ffffff", fontSize: 20, fontWeight: "900" }}>
            PixelQR
          </Text>
          <Text selectable style={{ color: "#9fb0c9", fontSize: 13 }}>
            Professional QR workflows for modern teams.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
          {links.map((link) => (
            <Text key={link} selectable style={{ color: "#d4deed", fontWeight: "800", fontSize: 13 }}>
              {link}
            </Text>
          ))}
        </View>
      </View>
    </SectionShell>
  );
}
