import { videoUrl } from "../manifest";

type Props = {
  videoA: string;
  videoB: string;
};

export default function VideoPair({ videoA, videoB }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[
        { label: "Video A", src: videoA },
        { label: "Video B", src: videoB },
      ].map(({ label, src }) => (
        <figure
          key={label}
          className="overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm"
        >
          <video
            key={src}
            src={videoUrl(src)}
            controls
            preload="metadata"
            playsInline
            className="aspect-video w-full bg-black"
          />
          <figcaption className="bg-white px-3 py-2 text-xs font-medium text-slate-600">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
