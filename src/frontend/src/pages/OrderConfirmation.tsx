import { useEffect, useState } from "react";
import { navigate } from "../App";

function generateVoucherCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "ME-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const GOLD = "#D4AF37";
const GOLD_DIM = "rgba(212,175,55,0.6)";
const GOLD_FAINT = "rgba(212,175,55,0.15)";

const cardStyle: React.CSSProperties = {
  background: "#000",
  border: `2px solid ${GOLD}`,
  boxShadow: `0 0 0 6px #000, 0 0 0 8px ${GOLD}, 0 0 0 14px #000, 0 0 0 16px rgba(212,175,55,0.3)`,
  borderRadius: 4,
  padding: 28,
  maxWidth: 480,
  width: "100%",
  fontFamily: "Montserrat, sans-serif",
  position: "relative",
};

const dividerStyle: React.CSSProperties = {
  borderColor: GOLD,
  opacity: 0.5,
  margin: "12px 0",
};

const sectionBoxStyle: React.CSSProperties = {
  border: `1px solid ${GOLD}`,
  background: GOLD_FAINT,
  borderRadius: 4,
  padding: "14px 16px",
  marginBottom: 14,
};

const termBoxStyle: React.CSSProperties = {
  border: "1px solid rgba(212,175,55,0.4)",
  background: "rgba(212,175,55,0.05)",
  borderRadius: 4,
  padding: "14px 16px",
  marginBottom: 14,
};

const cornerPositions: React.CSSProperties[] = [
  { top: 8, left: 10 },
  { top: 8, right: 10 },
  { bottom: 8, left: 10 },
  { bottom: 8, right: 10 },
];

const cornerKeys = ["tl", "tr", "bl", "br"];

export default function OrderConfirmation() {
  const [voucherCode] = useState(generateVoucherCode);
  const [customerName, setCustomerName] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState("");

  useEffect(() => {
    setCustomerName(localStorage.getItem("me_customer_name") || "");
    const rawId = localStorage.getItem("me_last_order_id") || "";
    setOrderId(rawId ? rawId.slice(0, 12).toUpperCase() : "");
    const rawTotal = localStorage.getItem("me_last_order_total") || "";
    if (rawTotal) {
      const totalINR = Number(rawTotal) / 100;
      setOrderTotal(`₹${totalINR.toLocaleString("en-IN")}`);
    }
  }, []);

  return (
    <div
      data-ocid="order_confirmation.panel"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "#000" }}
    >
      <div style={cardStyle}>
        {/* Corner ornaments */}
        {cornerPositions.map((pos, idx) => (
          <span
            key={cornerKeys[idx]}
            style={{
              position: "absolute",
              color: GOLD,
              fontSize: 18,
              lineHeight: 1,
              ...pos,
            }}
          >
            ✦
          </span>
        ))}

        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: GOLD,
              letterSpacing: "0.08em",
              lineHeight: 1,
              fontFamily: "'Playfair Display', 'Georgia', serif",
              textShadow: "0 0 30px rgba(212,175,55,0.4)",
            }}
          >
            ME
          </div>
          <div
            style={{
              color: GOLD,
              fontSize: 13,
              letterSpacing: "0.35em",
              fontWeight: 700,
              marginTop: 2,
            }}
          >
            MEET ENTERPRISES
          </div>
          <hr style={dividerStyle} />
          <div
            style={{
              color: GOLD,
              fontSize: 17,
              fontWeight: 900,
              letterSpacing: "0.18em",
              margin: "8px 0",
            }}
          >
            DIGITAL LUCKY VOUCHER CARD
          </div>
          <hr style={dividerStyle} />
        </div>

        {/* Congratulations */}
        <div
          style={{
            ...sectionBoxStyle,
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            marginTop: 14,
          }}
        >
          <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>🎁</span>
          <div>
            <div
              style={{
                color: GOLD,
                fontWeight: 900,
                fontSize: 16,
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              Congratulations!
            </div>
            <p
              style={{
                color: "#fff",
                fontSize: 12.5,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Thank you for shopping with Meet Enterprises. You have received a{" "}
              <span style={{ color: GOLD, fontWeight: 700 }}>
                Lucky Voucher Card
              </span>
              .
            </p>
          </div>
        </div>

        {/* Voucher Details */}
        <div style={sectionBoxStyle}>
          <div
            style={{
              textAlign: "center",
              color: GOLD,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.3em",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                flex: 1,
                height: 1,
                background: GOLD_DIM,
                display: "inline-block",
              }}
            />
            VOUCHER DETAILS
            <span
              style={{
                flex: 1,
                height: 1,
                background: GOLD_DIM,
                display: "inline-block",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {orderId && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ color: GOLD_DIM, fontSize: 12, fontWeight: 600 }}
                >
                  Order ID:
                </span>
                <span
                  style={{
                    color: GOLD,
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                  }}
                >
                  #{orderId}
                </span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: GOLD_DIM, fontSize: 12, fontWeight: 600 }}>
                Voucher Code:
              </span>
              <span
                data-ocid="order_confirmation.card"
                style={{
                  color: GOLD,
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: "0.15em",
                  background: "rgba(212,175,55,0.08)",
                  padding: "2px 10px",
                  borderRadius: 3,
                  border: `1px solid ${GOLD}`,
                }}
              >
                {voucherCode}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: GOLD_DIM, fontSize: 12, fontWeight: 600 }}>
                Customer Name:
              </span>
              <span
                style={{
                  color: "#fff",
                  fontSize: 12,
                  minWidth: 100,
                  borderBottom: `1px solid ${GOLD_DIM}`,
                  paddingBottom: 1,
                }}
              >
                {customerName || "___________________"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              <span style={{ color: GOLD_DIM, fontSize: 12, fontWeight: 600 }}>
                Purchase Amount:{" "}
                <span style={{ color: "#fff" }}>
                  {orderTotal || "₹ ________"}
                </span>
              </span>
              <span style={{ color: GOLD_DIM, fontSize: 12, fontWeight: 600 }}>
                Voucher Value:{" "}
                <span style={{ color: GOLD, fontWeight: 700 }}>
                  ₹1 – 10,000
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div
          style={{ ...sectionBoxStyle, background: "rgba(212,175,55,0.07)" }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12.5,
              lineHeight: 1.7,
              color: "#fff",
            }}
          >
            <span style={{ color: GOLD, fontWeight: 700 }}>Announcement: </span>
            Winning voucher codes will be announced on our official website.
          </p>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              fontSize: 11.5,
            }}
          >
            <span style={{ color: GOLD, fontWeight: 700 }}>
              Offer Valid Till: 20 April
            </span>
            <span style={{ color: GOLD_DIM }}>·</span>
            <span style={{ color: GOLD, fontWeight: 700 }}>
              Total Winners: Minimum 15 Lucky Winners
            </span>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div style={termBoxStyle}>
          <div
            style={{
              textAlign: "center",
              color: GOLD,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.3em",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                flex: 1,
                height: 1,
                background: GOLD_DIM,
                display: "inline-block",
              }}
            />
            TERMS &amp; CONDITIONS
            <span
              style={{
                flex: 1,
                height: 1,
                background: GOLD_DIM,
                display: "inline-block",
              }}
            />
          </div>
          <ol
            style={{
              margin: 0,
              padding: "0 0 0 18px",
              color: "#fff",
              fontSize: 11.5,
              lineHeight: 1.8,
            }}
          >
            <li>
              This voucher is issued only on minimum purchase of ₹1500 from Meet
              Enterprises.
            </li>
            <li>
              Each eligible purchase will receive one{" "}
              <strong style={{ color: GOLD }}>lucky voucher card</strong>.
            </li>
            <li>
              Winning voucher codes will be randomly selected and announced on
              our website.
            </li>
            <li>
              Winners must present the{" "}
              <strong style={{ color: GOLD }}>original voucher code</strong> to
              claim the prize.
            </li>
            <li>
              The voucher amount can be redeemed only at Meet Enterprises.
            </li>
            <li>The voucher cannot be exchanged for cash.</li>
            <li>
              If the voucher code is damaged or unreadable, it may become{" "}
              <strong style={{ color: GOLD }}>invalid</strong>.
            </li>
            <li>
              Meet Enterprises reserves the right to modify or cancel the scheme
              if required.
            </li>
          </ol>
        </div>

        {/* Card Footer */}
        <div
          style={{
            textAlign: "center",
            borderTop: "1px solid rgba(212,175,55,0.3)",
            paddingTop: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              color: GOLD,
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            📍 Meet Enterprises
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 10.5,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Wholesaler of Kurta, Pant, Shirt, T-Shirt, Sherwani, Koti Kurta,
            Blazer &amp; Jodhpuri.
          </p>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              color: GOLD,
              fontSize: 16,
            }}
          >
            <span>◈</span>
            <span>❧</span>
            <span>◈</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          data-ocid="order_confirmation.continue.button"
          onClick={() => navigate("")}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onFocus={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onBlur={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          style={{
            width: "100%",
            padding: "14px 0",
            background: GOLD,
            color: "#000",
            border: "none",
            borderRadius: 3,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: "0.2em",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
}
