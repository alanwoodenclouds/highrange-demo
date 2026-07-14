import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Share2 } from "lucide-react";
import { BRANCHES } from "@/data/constants";
import { CATEGORIES_WITH_COUNTS } from "@/data";
import { BrandLogo } from "@/components/shared/brand-logo";

const SOCIAL = [
  { label: "Website", icon: Globe },
  { label: "Share", icon: Share2 },
];

export function StoreFooter() {
  return (
    <footer className="relative bg-zinc-950 text-zinc-400 mt-auto overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <BrandLogo variant="full" size="md" href="/" className="mb-5" />
            <p className="text-sm text-zinc-500 leading-relaxed mb-6 max-w-xs">
              Premium home appliances and electronics across the high ranges of Idukki.
              Trusted by thousands of Kerala families.
            </p>
            <div className="flex gap-2">
              {SOCIAL.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="h-9 w-9 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-5">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES_WITH_COUNTS.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link href={`/products?category=${c.slug}`} className="hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-5">Our Stores</h4>
            <ul className="space-y-2.5 text-sm">
              {BRANCHES.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-zinc-400">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-zinc-300">
                <Phone className="h-4 w-4 text-primary" /> 1800-HIGHRANGE
              </li>
              <li className="flex items-center gap-2.5 text-zinc-300">
                <Mail className="h-4 w-4 text-primary" /> hello@highrange.in
              </li>
              <li className="text-zinc-500 mt-4 leading-relaxed">
                Mon–Sat: 9:30 AM – 8:00 PM<br />
                Sunday: 10:00 AM – 6:00 PM
              </li>
            </ul>
            <div className="mt-6 space-y-2">
              <Link
                href="/mobile"
                className="block text-xs text-primary hover:text-red-300 transition-colors"
              >
                Mobile preview → Interactive demo
              </Link>
              <Link
                href="/admin"
                className="block text-xs text-primary hover:text-red-300 transition-colors"
              >
                Staff Login → Store Management
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between gap-4 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Highrange Home Appliances. Demo for client presentation.</p>
          <div className="flex gap-5">
            <span className="hover:text-zinc-400 cursor-default">Privacy</span>
            <span className="hover:text-zinc-400 cursor-default">Terms</span>
            <span className="hover:text-zinc-400 cursor-default">Returns & Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
