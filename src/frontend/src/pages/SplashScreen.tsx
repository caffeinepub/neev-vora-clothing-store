import { useEffect } from "react";

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, 8000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <button
      type="button"
      data-ocid="splash.panel"
      onClick={onDone}
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer border-0 w-full h-full"
      style={{ background: "#000", zIndex: 9999 }}
    >
      <img
        src="/assets/uploads/1781-photoaidcom-cropped.jpg-1.png"
        alt="Meet Enterprise"
        style={{ width: "280px", height: "auto", objectFit: "contain" }}
      />
      <p
        className="text-xs tracking-[0.4em] font-light animate-pulse"
        style={{
          color: "rgba(212,175,55,0.85)",
          fontFamily: "Montserrat, sans-serif",
          position: "absolute",
          bottom: "2rem",
          letterSpacing: "0.4em",
        }}
      >
        TAP TO ENTER
      </p>
    </button>
  );
}
