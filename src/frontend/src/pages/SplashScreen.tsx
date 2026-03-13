import { useEffect } from "react";

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3500);
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
      <div className="relative w-full max-w-xs sm:max-w-sm">
        <img
          src="/assets/uploads/dqtdbsyn59rmt0cwr9ar9fazp0_result_-2.gif"
          alt="Meet Enterprise"
          className="w-full h-auto"
        />
      </div>
      <p
        className="mt-6 text-xs tracking-[0.4em] font-light"
        style={{
          color: "rgba(212,175,55,0.5)",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        TAP TO ENTER
      </p>
    </button>
  );
}
