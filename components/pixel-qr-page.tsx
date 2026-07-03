import { Linking, ScrollView, Text, View } from "react-native";
import { AppHeader } from "@/components/app-header";
import { HeroSection } from "@/components/hero-section";
import { QRGenerator } from "@/components/qr-generator";
import { TemplateCard } from "@/components/template-card";
import { SectionShell } from "@/components/ui";
import { HistoryPanel } from "@/components/history-panel";
import { BrandKitPanel } from "@/components/brand-kit-panel";
import { BulkGenerator } from "@/components/bulk-generator";
import { SequentialGenerator } from "@/components/sequential-generator";
import { LabelSheetGenerator } from "@/components/label-sheet-generator";
import { ApiSection as ApiSectionPanel } from "@/components/api-section";
import { colors } from "@/constants/theme";

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
    visualStyle: "business-card",
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
    visualStyle: "menu-poster",
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
    visualStyle: "social-card",
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
    visualStyle: "chat-card",
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
    visualStyle: "wifi-card",
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
    visualStyle: "payment-standee",
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
    visualStyle: "event-pass",
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
    visualStyle: "app-card",
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
    visualStyle: "map-card",
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
    visualStyle: "brand-header",
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
    visualStyle: "campaign-poster",
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
    visualStyle: "coupon-ticket",
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
    visualStyle: "review-standee",
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
    visualStyle: "email-card",
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
    visualStyle: "call-card",
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
    visualStyle: "product-label",
  },
  {
    id: "health",
    title: "Health Pass QR",
    subtitle: "Medical records, vaccination status, and health check-ins.",
    category: "Health",
    accent: "#059669",
    surface: "#ecfdf5",
    payload: "https://myhealthpass.app",
    format: "Health pass",
    bestFor: "Clinics, gyms, pharmacies, and vaccination centers.",
    fields: ["Records", "Status", "Check-in", "Provider"],
    visualStyle: "health-card",
  },
  {
    id: "realestate",
    title: "Real Estate QR",
    subtitle: "Property listings, virtual tours, and agent contact.",
    category: "Real Estate",
    accent: "#d97706",
    surface: "#fffbeb",
    payload: "https://property.virtu.com/estate-42",
    format: "Property link",
    bestFor: "Open houses, flyers, signboards, and agent cards.",
    fields: ["Listing", "Tour", "Price", "Agent"],
    visualStyle: "realestate-card",
  },
  {
    id: "music",
    title: "Music QR",
    subtitle: "Playlists, albums, and artist profiles on streaming platforms.",
    category: "Music",
    accent: "#22c55e",
    surface: "#f0fdf4",
    payload: "https://open.spotify.com/playlist",
    format: "Playlist link",
    bestFor: "Album art, flyers, merch, and venue posters.",
    fields: ["Playlist", "Artist", "Album", "Platform"],
    visualStyle: "music-card",
  },
  {
    id: "podcast",
    title: "Podcast QR",
    subtitle: "Episode links, show notes, and subscription pages.",
    category: "Podcast",
    accent: "#a855f7",
    surface: "#faf5ff",
    payload: "https://podcasts.apple.com/thenarrative",
    format: "Podcast link",
    bestFor: "Show art, business cards, social posts, and merch.",
    fields: ["Episode", "Show", "Platform", "Subscribe"],
    visualStyle: "podcast-card",
  },
  {
    id: "youtube",
    title: "YouTube QR",
    subtitle: "Channel links, video pages, and playlists.",
    category: "YouTube",
    accent: "#ef4444",
    surface: "#fef2f2",
    payload: "https://youtube.com/@pixelqr",
    format: "Channel link",
    bestFor: "Video thumbnails, merch, banners, and business cards.",
    fields: ["Channel", "Video", "Subscribe", "Playlist"],
    visualStyle: "youtube-card",
  },
  {
    id: "wedding",
    title: "Wedding QR",
    subtitle: "RSVPs, registries, photo albums, and save-the-dates.",
    category: "Wedding",
    accent: "#db2777",
    surface: "#fdf2f8",
    payload: "https://ourwedding.app/rsvp",
    format: "Wedding page",
    bestFor: "Invitations, save-the-dates, place cards, and signage.",
    fields: ["RSVP", "Registry", "Gallery", "Venue"],
    visualStyle: "wedding-card",
  },
  {
    id: "conference",
    title: "Conference QR",
    subtitle: "Speaker profiles, session info, and attendee networking.",
    category: "Conference",
    accent: "#0ea5e9",
    surface: "#ecfeff",
    payload: "BEGIN:VCARD\nFN:Dr. Sarah Chen\nEND:VCARD",
    format: "Speaker badge",
    bestFor: "Badges, session handouts, signage, and networking cards.",
    fields: ["Speaker", "Session", "Company", "Contact"],
    visualStyle: "conference-card",
  },
  {
    id: "charity",
    title: "Charity QR",
    subtitle: "Donation pages, mission info, and volunteer sign-ups.",
    category: "Charity",
    accent: "#ec4899",
    surface: "#fdf4ff",
    payload: "https://donate.hope.org/give",
    format: "Donation link",
    bestFor: "Fundraising events, flyers, booths, and mailers.",
    fields: ["Donate", "Mission", "Volunteer", "Impact"],
    visualStyle: "charity-card",
  },
  {
    id: "newsletter",
    title: "Newsletter QR",
    subtitle: "Sign-up pages, issue archives, and subscription links.",
    category: "Newsletter",
    accent: "#f59e0b",
    surface: "#fefce8",
    payload: "https://theweekly.pixelqr.app",
    format: "Newsletter signup",
    bestFor: "Blog posts, social media, events, and business cards.",
    fields: ["Subscribe", "Archive", "Topics", "Frequency"],
    visualStyle: "newsletter-card",
  },
  {
    id: "travel",
    title: "Travel QR",
    subtitle: "Itineraries, booking confirmations, and destination guides.",
    category: "Travel",
    accent: "#06b6d4",
    surface: "#ecfeff",
    payload: "https://travel.pixelqr.app/itinerary",
    format: "Trip itinerary",
    bestFor: "Boarding passes, hotel keys, tour guides, and luggage tags.",
    fields: ["Itinerary", "Bookings", "Maps", "Guide"],
    visualStyle: "travel-card",
  },
  {
    id: "recipe",
    title: "Recipe QR",
    subtitle: "Step-by-step recipes, ingredient lists, and cooking videos.",
    category: "Food",
    accent: "#ea580c",
    surface: "#fff7ed",
    payload: "https://recipes.pixelqr.app/pasta",
    format: "Recipe card",
    bestFor: "Cookbooks, food packaging, menus, and class handouts.",
    fields: ["Ingredients", "Steps", "Video", "Time"],
    visualStyle: "recipe-card",
  },
  {
    id: "survey",
    title: "Survey QR",
    subtitle: "Feedback forms, polls, and customer satisfaction surveys.",
    category: "Feedback",
    accent: "#6366f1",
    surface: "#eef2ff",
    payload: "https://survey.pixelqr.app/feedback",
    format: "Feedback form",
    bestFor: "Receipts, counters, emails, and post-service cards.",
    fields: ["Form", "Rating", "Anonymous", "Reward"],
    visualStyle: "survey-card",
  },
  {
    id: "fitness",
    title: "Fitness QR",
    subtitle: "Class schedules, booking pages, and membership info.",
    category: "Fitness",
    accent: "#dc2626",
    surface: "#fef2f2",
    payload: "https://fitstudio.app/classes",
    format: "Class booking",
    bestFor: "Gym counters, locker rooms, schedules, and promo cards.",
    fields: ["Schedule", "Book", "Membership", "Trainer"],
    visualStyle: "fitness-card",
  },
  {
    id: "resume",
    title: "Resume QR",
    subtitle: "Digital resumes, portfolios, and career profiles.",
    category: "Career",
    accent: "#3b82f6",
    surface: "#eff6ff",
    payload: "BEGIN:VCARD\nFN:Jordan Lee\nEND:VCARD",
    format: "Digital resume",
    bestFor: "Business cards, networking events, portfolios, and email signatures.",
    fields: ["Name", "Role", "Skills", "Contact"],
    visualStyle: "resume-card",
  },
] as const;

const features = [
  [
    "Real-time QR preview",
    "Every change updates the preview immediately so teams can design without switching tools.",
  ],
  [
    "Brand color customization",
    "Use calm defaults, precise hex colors, gradients, and reusable presets.",
  ],
  [
    "Logo support",
    "Add a square brand mark with sizing guidance to protect the QR matrix.",
  ],
  [
    "Scan-safe validation",
    "Contrast, logo size, and quiet-zone checks help keep finished codes reliable.",
  ],
  [
    "PNG/SVG/PDF export",
    "Export clean assets for campaigns, signage, documents, and social posts.",
  ],
  [
    "History & Brand Kits",
    "Save your configurations and brand styles for quick reuse across projects.",
  ],
  [
    "Calendar & Crypto QR",
    "Generate calendar event QR codes and Bitcoin/Ethereum payment addresses.",
  ],
  [
    "Custom frames with CTA",
    "Add custom labels and call-to-action buttons to your QR code frames.",
  ],
  [
    "QR Beautification",
    "Custom module shapes, background patterns, and animated SVG export.",
  ],
  [
    "Bulk Generation",
    "Generate dozens of QR codes at once from CSV data, download as ZIP.",
  ],
  [
    "REST API",
    "Programmatic QR generation for CI/CD pipelines and automation.",
  ],
  [
    "30 Ready Templates",
    "From business cards to wedding RSVPs, health passes to resumes — a template for every use case.",
  ],
  [
    "Advanced Customization",
    "7 dot styles, 5 eye styles, 8 frame styles, corner radius, shadow depth, and QR beautification.",
  ],
] as const;

export function PixelQRPage() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <AppHeader />
      <HeroSection />
      <QRGenerator />
      <TemplatesSection />
      <HistorySection />
      <BrandKitsSection />
      <SequentialSection />
      <LabelSheetSection />
      <BulkSection />
      <ApiDocsSection />
      <FeaturesSection />
      <Footer />
    </ScrollView>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: Readonly<{ eyebrow: string; title: string; body: string }>) {
  return (
    <View style={{ gap: 10, maxWidth: 760 }}>
      <View
        style={{
          borderWidth: 3,
          borderColor: "#000",
          backgroundColor: colors.accent,
          paddingHorizontal: 10,
          paddingVertical: 4,
          alignSelf: "flex-start",
          boxShadow: "3px 3px 0px 0px #000",
        }}
      >
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </Text>
      </View>
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "900",
          fontSize: 44,
          lineHeight: 46,
          letterSpacing: -1.5,
        }}
      >
        {title}
      </Text>
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "700",
          fontSize: 17,
          lineHeight: 26,
          opacity: 0.7,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

function HistorySection() {
  return (
    <SectionShell
      id="history"
      style={{
        backgroundColor: colors.background,
        paddingVertical: 60,
      }}
    >
      <View style={{ gap: 32 }}>
        <SectionHeading
          eyebrow="History"
          title="Your saved QR configurations."
          body="Save, browse, and restore previously generated QR codes."
        />
        <HistoryPanel />
      </View>
    </SectionShell>
  );
}

function BrandKitsSection() {
  return (
    <SectionShell
      id="brand-kits"
      style={{
        backgroundColor: colors.secondary,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: "#000",
        paddingVertical: 60,
      }}
    >
      <View style={{ gap: 32 }}>
        <SectionHeading
          eyebrow="Brand Kits"
          title="Reusable style presets."
          body="Save your color schemes and styles as brand kits for consistent branding."
        />
        <BrandKitPanel />
      </View>
    </SectionShell>
  );
}

function SequentialSection() {
  return (
    <SectionShell
      id="sequential"
      style={{
        backgroundColor: colors.background,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: "#000",
        paddingVertical: 60,
      }}
    >
      <View style={{ gap: 32 }}>
        <SectionHeading
          eyebrow="Sequential"
          title="Generate QR codes in sequence."
          body="Create QR-001, QR-002, … with auto-incrementing labels and custom content templates."
        />
        <SequentialGenerator />
      </View>
    </SectionShell>
  );
}

function LabelSheetSection() {
  return (
    <SectionShell
      id="labels"
      style={{
        backgroundColor: colors.background,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: "#000",
        paddingVertical: 60,
      }}
    >
      <View style={{ gap: 32 }}>
        <SectionHeading
          eyebrow="Labels"
          title="Print QR codes on label sheets."
          body="Arrange QR codes in a grid for Avery-compatible adhesive labels."
        />
        <LabelSheetGenerator />
      </View>
    </SectionShell>
  );
}

function BulkSection() {
  return (
    <SectionShell
      id="bulk"
      style={{
        backgroundColor: colors.background,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: "#000",
        paddingVertical: 60,
      }}
    >
      <View style={{ gap: 32 }}>
        <SectionHeading
          eyebrow="Bulk"
          title="Generate QR codes in batches."
          body="Paste CSV data with labels and content URLs, then download all as a ZIP."
        />
        <BulkGenerator />
      </View>
    </SectionShell>
  );
}

function ApiDocsSection() {
  return (
    <SectionShell
      id="api"
      style={{
        backgroundColor: colors.background,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: "#000",
        paddingVertical: 60,
      }}
    >
      <View style={{ gap: 32 }}>
        <SectionHeading
          eyebrow="API"
          title="Programmatic QR generation."
          body="Integrate QR generation into your workflows with a simple REST API."
        />
        <ApiSectionPanel />
      </View>
    </SectionShell>
  );
}

function FeaturesSection() {
  return (
    <SectionShell
      style={{
        backgroundColor: colors.secondary,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: "#000",
        paddingVertical: 72,
      }}
    >
      <View style={{ gap: 40 }}>
        <SectionHeading
          eyebrow="Features"
          title="Built for scanning, not just showing."
          body="Every detail from contrast to export is tuned so your QR codes work reliably in the real world."
        />

        <View style={{ gap: 16 }}>
          {features.map(([title, body], index) => (
            <View
              key={title}
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "flex-start",
                borderWidth: 4,
                borderColor: "#000",
                backgroundColor: colors.white,
                padding: 18,
                boxShadow: "6px 6px 0px 0px #000",
                transform: [
                  { rotate: index % 2 === 0 ? "0.5deg" : "-0.5deg" },
                ],
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderWidth: 3,
                  borderColor: "#000",
                  backgroundColor: colors.accent,
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "3px 3px 0px 0px #000",
                }}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderWidth: 3,
                    borderColor: "#000",
                    backgroundColor: "#000",
                    transform: [{ rotate: "10deg" }],
                  }}
                />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "900",
                    fontSize: 16,
                    textTransform: "uppercase",
                    letterSpacing: -0.3,
                  }}
                >
                  {title}
                </Text>
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "700",
                    fontSize: 14,
                    opacity: 0.65,
                  }}
                >
                  {body}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SectionShell>
  );
}

function TemplatesSection() {
  return (
    <SectionShell
      id="templates"
      style={{
        backgroundColor: colors.background,
        paddingVertical: 84,
      }}
    >
      <View style={{ gap: 40 }}>
        <SectionHeading
          eyebrow="Templates"
          title="Start from practical QR presets."
          body="Polished templates for the most common business, creator, hospitality, and campaign workflows."
        />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 18,
            justifyContent: "center",
          }}
        >
          {templates.map((template, i) => (
            <View
              key={template.id}
              style={{
                transform: [
                  {
                    rotate:
                      i % 4 === 0
                        ? "1deg"
                        : i % 4 === 1
                          ? "-0.5deg"
                          : i % 4 === 2
                            ? "0.8deg"
                            : "-1.2deg",
                  },
                ],
              }}
            >
              <TemplateCard {...template} />
            </View>
          ))}
        </View>
      </View>
    </SectionShell>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <SectionShell
      style={{
        backgroundColor: "#000",
        paddingVertical: 40,
        borderTopWidth: 4,
        borderTopColor: colors.accent,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <View style={{ gap: 6 }}>
          <View
            style={{
              borderWidth: 3,
              borderColor: colors.white,
              backgroundColor: colors.accent,
              paddingHorizontal: 10,
              paddingVertical: 5,
              alignSelf: "flex-start",
            }}
          >
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontWeight: "900",
                fontSize: 18,
                textTransform: "uppercase",
                letterSpacing: -0.5,
              }}
            >
              PixelQR
            </Text>
          </View>
          <Text
            selectable
            style={{
              color: colors.white,
              fontWeight: "700",
              fontSize: 12,
              opacity: 0.6,
            }}
          >
            Copyright {year}{" "}
            <Text
              selectable={false}
              onPress={() =>
                Linking.openURL("https://github.com/adsalihac")
              }
              style={{
                color: colors.white,
                textDecorationLine: "underline",
                fontWeight: "900",
                opacity: 0.8,
              }}
            >
              adsalihac
            </Text>
          </Text>
        </View>
        <PressableFooter
          label="Buy me a coffee"
          onPress={() =>
            Linking.openURL("https://buymeacoffee.com/adsalihac")
          }
        />
      </View>
    </SectionShell>
  );
}

function PressableFooter({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Text
      selectable={false}
      onPress={onPress}
      style={{
        borderWidth: 3,
        borderColor: colors.secondary,
        backgroundColor: "transparent",
        color: colors.secondary,
        fontWeight: "900",
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        paddingHorizontal: 14,
        paddingVertical: 8,
        overflow: "hidden",
      }}
    >
      {label}
    </Text>
  );
}
