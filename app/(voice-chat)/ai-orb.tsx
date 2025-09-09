"use client";

import Image from "next/image";

type Props = {
  speaking?: boolean;
  size?: number; // pixel size; defaults to 96
};

export default function AiOrb({ speaking = false, size = 96 }: Props) {
  const dimension = `${size}px`;

  const blob = Math.max(24, Math.round(size * 0.46));

  return (
    <figure
      aria-label="AI"
      className="relative rounded-full bg-rose-500 shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_8px_24px_rgba(0,0,0,0.06)]"
      style={{ width: dimension, height: dimension }}
    >
      <div
        className={(speaking ? "animate-[spin_6s_linear_infinite]" : "animate-[spin_16s_linear_infinite]") + " absolute inset-0 z-0"}
      >
        <Image src="/vector1.png" alt="" width={blob} height={blob} className="absolute left-[32%] top-[36%] -translate-x-1/2 -translate-y-1/2 select-none" />
        <Image src="/vector2.png" alt="" width={blob} height={blob} className="absolute right-[32%] top-[36%] translate-x-1/2 -translate-y-1/2 select-none" />
        <Image src="/vector3.png" alt="" width={blob} height={blob} className="absolute left-1/2 bottom-[26%] -translate-x-1/2 translate-y-1/2 select-none" />
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-full overflow-hidden bg-white/20 backdrop-blur-md" style={{ WebkitBackdropFilter: "blur(12px)" }}>
        {/* Soft inner highlight from center outwards */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 42%, rgba(255,255,255,0.10) 62%, rgba(255,255,255,0.0) 78%)",
          }}
        />
        {/* Top gloss */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.24) 38%, rgba(255,255,255,0.0) 62%)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
        {/* Subtle inner ring to mimic glass edge */}
        <div className="absolute inset-0 rounded-full ring-1 ring-white/35 shadow-[inset_0_0_24px_rgba(255,255,255,0.35)]" />
      </div>
    </figure>
  );
}


