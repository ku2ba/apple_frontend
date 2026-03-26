"use client";

export function VideoSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16" aria-label="Видео">
      <div className="mx-auto max-w-[1920px]">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <video
            className="h-full w-full object-contain"
            src="/main/AnimationMain.mp4"
            controls
            playsInline
            preload="metadata"
            aria-label="Видео контент"
          >
            <track kind="captions" />
          </video>
        </div>
      </div>
    </section>
  );
}
