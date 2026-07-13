import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { About } from "@/components/site/About";
import { Testimonials } from "@/components/site/Testimonials";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Dosantoz Enterprises — Founder & Studio" },
      {
        name: "description",
        content:
          "Meet Nicholas Mwaniki, founder of Dosantoz Enterprises — a Nairobi-based studio building cinematic visual identities for ambitious brands.",
      },
      { property: "og:title", content: "About Dosantoz Enterprises" },
      { property: "og:description", content: "The studio, the founder, and how we work." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="pt-28">
        <About />
        <Testimonials />
      </div>
    </SiteLayout>
  ),
});
