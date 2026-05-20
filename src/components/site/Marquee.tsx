const items = [
  "Posters", "Branding", "Motion Graphics", "Social Media",
  "Event Flyers", "3D Text", "Logo Design", "Web Banners", "Album Art",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border/60 py-5">
      <div className="flex w-max gap-12 animate-marquee">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-12 font-display text-2xl md:text-3xl">
            <span className="text-muted-foreground/80">{t}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
