export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground md:flex-row">
        <div className="font-display tracking-widest">
          DOSANTOZ <span className="text-primary">ENTERPRISES</span>
        </div>
        <div>© {new Date().getFullYear()} — Creative Graphic Design Solutions.</div>
        <div className="flex gap-4">
          <a href="https://instagram.com/dosantoz_enterprises" target="_blank" rel="noreferrer" className="hover:text-primary">Instagram</a>
          <a href="https://tiktok.com/@dosantozenterprises" target="_blank" rel="noreferrer" className="hover:text-primary">TikTok</a>
        </div>
      </div>
    </footer>
  );
}
