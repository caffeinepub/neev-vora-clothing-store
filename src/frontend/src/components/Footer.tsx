import { Instagram, Mail } from "lucide-react";
import { navigate } from "../App";

const links = [
  { label: "Shop All", action: () => navigate("catalog") },
  { label: "Support & FAQ", action: () => navigate("support") },
  { label: "Admin", action: () => navigate("admin") },
  { label: "Contact", action: () => navigate("support") },
];

const instagramLinks = [
  {
    label: "@meet_.enterprise",
    url: "https://www.instagram.com/meet_.enterprise?igsh=MXg0ZHpuN3Q3NHlscg==",
  },
  {
    label: "@navkar_fashionn",
    url: "https://www.instagram.com/navkar_fashionn?igsh=YmF4Y2FsOGVvM2Fm",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-ocid="footer.panel"
      className="w-full mt-auto"
      style={{
        background: "#000",
        borderTop: "1px solid rgba(212,175,55,0.25)",
        color: "#D4AF37",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2
            className="text-xl font-black tracking-widest mb-3"
            style={{ color: "#D4AF37" }}
          >
            MEET ENTERPRISE
          </h2>
          <p
            className="text-xs tracking-widest mb-4"
            style={{ color: "rgba(212,175,55,0.5)" }}
          >
            LUXURY FASHION FOR MEN &amp; CHILDREN
          </p>
          <a
            data-ocid="footer.email.link"
            href="mailto:meetenterprise654@gmail.com"
            className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
            style={{ color: "rgba(212,175,55,0.7)" }}
          >
            <Mail size={14} />
            meetenterprise654@gmail.com
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            className="text-sm font-black tracking-[0.3em] mb-4"
            style={{ color: "#D4AF37" }}
          >
            QUICK LINKS
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  data-ocid={`footer.${link.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}.link`}
                  onClick={link.action}
                  className="text-sm hover:opacity-80 tracking-wider transition-opacity text-left"
                  style={{
                    color: "rgba(212,175,55,0.75)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <a
                data-ocid="footer.support-email.link"
                href="mailto:meetenterprise654@gmail.com"
                className="text-sm hover:opacity-80 tracking-wider transition-opacity"
                style={{ color: "rgba(212,175,55,0.75)" }}
              >
                meetenterprise654@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Instagram */}
        <div>
          <h3
            className="text-sm font-black tracking-[0.3em] mb-4"
            style={{ color: "#D4AF37" }}
          >
            FOLLOW US
          </h3>
          <ul className="space-y-3">
            {instagramLinks.map((ig, i) => (
              <li key={ig.label}>
                <a
                  data-ocid={`footer.instagram.link.${i + 1}`}
                  href={ig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:opacity-80 tracking-wider transition-opacity"
                  style={{ color: "rgba(212,175,55,0.75)" }}
                >
                  <Instagram size={14} style={{ color: "#D4AF37" }} />
                  {ig.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="px-6 py-4 text-center text-xs tracking-wider"
        style={{
          borderTop: "1px solid rgba(212,175,55,0.1)",
          color: "rgba(212,175,55,0.4)",
        }}
      >
        © {year} All Rights Reserved. This site is made by Neev Vora.
      </div>
    </footer>
  );
}
