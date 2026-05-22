import Image from "next/image";

type CardArtworkProps = {
  alt: string;
  src?: string | null;
  className?: string;
};

export function CardArtwork({ alt, src, className = "" }: CardArtworkProps) {
  const classes = ["card-artwork", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {src ? (
        <Image alt={alt} className="card-artwork__image" height={480} src={src} unoptimized width={640} />
      ) : (
        <div className="card-artwork__placeholder">暂无图面</div>
      )}
    </div>
  );
}
