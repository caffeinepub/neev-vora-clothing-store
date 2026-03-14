import { ChevronDown, ChevronUp, Instagram, Mail } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse our catalog, select your size and quantity, add items to your cart, and proceed to checkout. Fill in your delivery details and choose your preferred payment method.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD) and Google Pay (GPay). For GPay payments, scan the QR code or use our UPI ID provided at checkout.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is placed, you will receive an order confirmation. For tracking updates, please contact our support team at meetenterprise654@gmail.com.",
  },
  {
    q: "What is the return policy?",
    a: "We accept returns within 7 days of delivery for items in original, unworn condition with tags intact. Please contact meetenterprise654@gmail.com to initiate a return.",
  },
  {
    q: "How do I contact support?",
    a: "Email us at meetenterprise654@gmail.com. Our team is available to help you with any questions or concerns.",
  },
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

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden mb-3"
      style={{ border: "1px solid rgba(212,175,55,0.2)" }}
    >
      <button
        type="button"
        data-ocid="support.faq.toggle"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{
          background: "rgba(212,175,55,0.05)",
          color: "#D4AF37",
          fontFamily: "Montserrat, sans-serif",
          cursor: "pointer",
          border: "none",
        }}
      >
        <span className="font-semibold text-sm tracking-wider">{q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div
          className="px-6 py-4 text-sm"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "rgba(212,175,55,0.75)",
            fontFamily: "Montserrat, sans-serif",
            lineHeight: 1.7,
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function Support() {
  return (
    <div
      className="min-h-screen px-4 py-16"
      style={{ background: "#000", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-3xl font-black tracking-widest mb-2 text-center"
          style={{ color: "#D4AF37" }}
        >
          SUPPORT &amp; FAQ
        </h1>
        <p
          className="text-xs tracking-[0.3em] text-center mb-12"
          style={{ color: "rgba(212,175,55,0.5)" }}
        >
          WE&apos;RE HERE TO HELP
        </p>

        <section className="mb-12">
          <h2
            className="text-sm font-black tracking-[0.3em] mb-6"
            style={{ color: "rgba(212,175,55,0.7)" }}
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </section>

        {/* Instagram Section */}
        <section
          className="rounded-2xl p-8 mb-6"
          style={{
            background: "rgba(212,175,55,0.05)",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <Instagram
            size={32}
            className="mx-auto mb-4"
            style={{ color: "#D4AF37" }}
          />
          <h2
            className="text-lg font-black tracking-widest mb-2 text-center"
            style={{ color: "#D4AF37" }}
          >
            FOLLOW US ON INSTAGRAM
          </h2>
          <p
            className="text-sm mb-6 text-center"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Stay updated with our latest collections
          </p>
          <div className="flex flex-col gap-3">
            {instagramLinks.map((ig, i) => (
              <a
                key={ig.label}
                data-ocid={`support.instagram.link.${i + 1}`}
                href={ig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-bold tracking-wider text-sm hover:opacity-80 transition-opacity"
                style={{
                  background: "rgba(212,175,55,0.1)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#D4AF37",
                }}
              >
                <Instagram size={18} />
                {ig.label}
              </a>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl p-8 text-center"
          style={{
            background: "rgba(212,175,55,0.05)",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <Mail
            size={32}
            className="mx-auto mb-4"
            style={{ color: "#D4AF37" }}
          />
          <h2
            className="text-lg font-black tracking-widest mb-2"
            style={{ color: "#D4AF37" }}
          >
            CONTACT US
          </h2>
          <p className="text-sm mb-4" style={{ color: "rgba(212,175,55,0.6)" }}>
            Email us at
          </p>
          <a
            data-ocid="support.email.link"
            href="mailto:meetenterprise654@gmail.com"
            className="text-base font-bold tracking-wider hover:opacity-80 transition-opacity"
            style={{ color: "#D4AF37" }}
          >
            meetenterprise654@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
}
