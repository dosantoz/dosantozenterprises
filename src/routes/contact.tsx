import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Contact } from "@/components/site/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Dosantoz Enterprises — WhatsApp, Email, Phone" },
      {
        name: "description",
        content:
          "Talk to Dosantoz Enterprises about your next design project. WhatsApp 0706 658 803 or dosantozgfx@gmail.com.",
      },
      { property: "og:title", content: "Contact Dosantoz Enterprises" },
      { property: "og:description", content: "Start a project. We reply within an hour." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="pt-24">
        <Contact />
      </div>
    </SiteLayout>
  ),
});
