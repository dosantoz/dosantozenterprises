import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Portfolio } from "@/components/site/Portfolio";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Dosantoz Enterprises Design Work" },
      {
        name: "description",
        content:
          "Selected work: club posters, birthday flyers, church posters, business flyers, rollup banners and full brand identity kits.",
      },
      { property: "og:title", content: "Portfolio — Dosantoz Enterprises" },
      { property: "og:description", content: "Every category. Swipe through every design." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="pt-24">
        <Portfolio />
      </div>
    </SiteLayout>
  ),
});
