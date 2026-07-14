import Link from "next/link";
import { Share2, Globe, MessageCircle, Video, MapPin, Phone, Mail } from "lucide-react";
import { BRANCHES } from "@/data/constants";
import { CATEGORIES_WITH_COUNTS } from "@/data";

export function StoreFooter() {
  return (
    <footer className="bg-[#0a1628] text-slate-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg">Highrange</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Home Appliances</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Premium home appliances and electronics across the high ranges of Idukki.
              Trusted by thousands of Kerala families.
            </p>
            <div className="flex gap-3">
              {[Share2, Globe, MessageCircle, Video].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-white/5 hover:bg-teal-600 flex items-center justify-center transition-colors"
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
                  <Link href={`/products?category=${c.slug}`} className="hover:text-teal-400 transition-colors">
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
                  <MapPin className="h-3 w-3 text-teal-500 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-500" /> 1800-HIGHRANGE
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-500" /> hello@highrange.in
              </li>
              <li className="text-slate-400 mt-4">
                Mon–Sat: 9:30 AM – 8:00 PM<br />
                Sunday: 10:00 AM – 6:00 PM
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/admin"
                className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2"
              >
                Staff Login → Store Management
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
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
