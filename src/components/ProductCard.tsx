import Image from "next/image";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const imageUrl =
    product.imageUrl && product.imageUrl.length > 0
      ? product.imageUrl
      : "/assets/images/retros.png";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#b3b3b3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative w-full flex-1 min-h-[200px] bg-white p-3">
        <Image
          src={imageUrl}
          alt={product.description}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
      </div>
      <div className="bg-[#10456f] px-4 py-1 text-white h-[100px] overflow-hidden">
        <h3 className="text-sm font-extrabold leading-snug uppercase line-clamp-2">
          {product.description}
        </h3>
        <p className="text-xs font-extrabold uppercase">{product.brand ?? ""}</p>
        <p className="text-xs font-extrabold uppercase">{product.tags[2] ?? ""}</p>
        <p className="text-xs font-extrabold uppercase">{product.code ?? ""}</p>
      </div>
    </article>
  );
}
