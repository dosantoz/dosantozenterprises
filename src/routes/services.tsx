import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Services } from "@/components/site/Services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Poster, Branding, Motion & 3D Design" },
      {
        name: "description",
        content:
          "Poster & flyer design, brand identity, social media creatives, motion graphics, 3D typography and end-to-end event branding.",
      },
      { property: "og:title", content: "Services — Dosantoz Enterprises" },
      { property: "og:description", content: "Everything visual, under one roof." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="pt-24">
        <Services />
      </div>
    </SiteLayout>
  ),
});
