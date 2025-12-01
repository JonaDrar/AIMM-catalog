import Link from "next/link";
import SkeletonImage from "@/components/ui/SkeletonImage";
import type { Product } from "@/types/product";
import { buildProductSlug } from "@/lib/seo";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const imageUrl =
    product.imageUrl && product.imageUrl.length > 0
      ? product.imageUrl
      : "/assets/images/retros.png";

  return (
    <Link
      href={`/catalog/${buildProductSlug(product)}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#b3b3b3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10456f]"
      prefetch={false}
      aria-label={`Ver detalles de ${product.description}`}
    >
      <article className="flex h-full flex-col">
        <SkeletonImage
          src={imageUrl}
          alt={product.description}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          containerClassName="relative w-full flex-1 min-h-[200px] bg-white p-3"
          imageClassName="object-contain transition duration-150 group-hover:scale-[1.01]"
          priority={false}
        />
        <div className="bg-[#10456f] px-4 py-2 text-white h-[110px] overflow-hidden">
          <h3 className="text-sm font-extrabold leading-snug uppercase line-clamp-2">
            {product.description}
          </h3>
          <p className="text-[11px] font-extrabold uppercase">{product.brand ?? ""}</p>
          <p className="text-[11px] font-extrabold uppercase">{product.model ?? ""}</p>
          <p className="text-[11px] font-extrabold uppercase">{product.code ?? ""}</p>
        </div>
      </article>
    </Link>
  );
}
