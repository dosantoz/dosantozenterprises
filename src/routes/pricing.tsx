import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Pricing } from "@/components/site/Pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Simple, Premium Design Packages" },
      {
        name: "description",
        content:
          "Transparent design pricing: from single flyer designs to full brand identity kits and custom event/campaign packages.",
      },
      { property: "og:title", content: "Pricing — Dosantoz Enterprises" },
      { property: "og:description", content: "Simple, premium design packages." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="pt-24">
        <Pricing />
      </div>
    </SiteLayout>
  ),
});
