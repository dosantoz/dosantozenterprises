import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { About } from "@/components/site/About";
import { Portfolio } from "@/components/site/Portfolio";
import { Services } from "@/components/site/Services";
import { Testimonials } from "@/components/site/Testimonials";
import { Pricing } from "@/components/site/Pricing";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dosantoz Enterprises — Creative Graphic Design Solutions" },
      {
        name: "description",
        content:
          "Premium graphic design studio: posters, branding, motion graphics, social media designs, event flyers and 3D text designs.",
      },
      { property: "og:title", content: "Dosantoz Enterprises — Creative Graphic Design" },
      {
        property: "og:description",
        content:
          "Posters • Branding • Motion Graphics • Social Media Designs • Event Flyers • 3D Text Designs.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Portfolio />
      <Services />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
