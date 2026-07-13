import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { About } from "@/components/site/About";
import { Portfolio } from "@/components/site/Portfolio";
import { Services } from "@/components/site/Services";
import { Testimonials } from "@/components/site/Testimonials";
import { Pricing } from "@/components/site/Pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dosantoz Enterprises — Creative Graphic Design in Nairobi" },
      {
        name: "description",
        content:
          "Bold posters, branding, motion graphics and event flyers. Start your project online, track it in your dashboard, get delivered files in 24h.",
      },
      { property: "og:title", content: "Dosantoz Enterprises — Creative Graphic Design" },
      {
        property: "og:description",
        content: "Posters • Branding • Motion Graphics • Social Designs • Event Flyers • 3D Type.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Marquee />
      <About />
      <Portfolio />
      <Services />
      <Testimonials />
      <Pricing />
      <section className="relative py-20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Ready to <span className="text-gradient">start your project</span>?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Book online in under a minute. Track progress, chat with your designer, download files.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/order"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Start a project →
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full glass px-6 py-3 text-sm font-semibold"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
