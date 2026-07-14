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
    <footer className="bg-black text-neutral-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <BrandLogo variant="full" size="md" href="/" className="mb-4" />
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              Premium home appliances and electronics across the high ranges of Idukki.
              Trusted by thousands of Kerala families.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="h-9 w-9 rounded-lg bg-white/5 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES_WITH_COUNTS.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link href={`/products?category=${c.slug}`} className="hover:text-primary transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Our Stores</h4>
            <ul className="space-y-2 text-sm">
              {BRANCHES.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-primary shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> 1800-HIGHRANGE
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> hello@highrange.in
              </li>
              <li className="text-neutral-400 mt-4">
                Mon–Sat: 9:30 AM – 8:00 PM<br />
                Sunday: 10:00 AM – 6:00 PM
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/admin"
                className="text-xs text-primary hover:text-red-300 underline underline-offset-2"
              >
                Staff Login → Store Management
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Highrange Home Appliances. Demo for client presentation.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Returns & Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
