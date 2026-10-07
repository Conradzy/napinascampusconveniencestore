import Image from "next/image";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import { Icon } from "./icon";

const categoryColors = {
  Snacks: "bg-[#f6eddd]",
  Drinks: "bg-[#e9eff0]",
  "School Supplies": "bg-[#edefe4]",
};

export function ProductCard({ product, quantity, disabled, onAdd }: {
  product: Product;
  quantity: number;
  disabled: boolean;
  onAdd: () => void;
}) {
  return (
    <article className="rounded-[22px] border border-line bg-white p-3.5">
      <div className={"relative flex h-40 items-center justify-center overflow-hidden rounded-xl xl:h-44 " + categoryColors[product.category]}>
        <Image src={product.image} alt={"Illustration of " + product.name} width={200} height={180} className="h-full w-full object-contain p-2" />
        {quantity > 0 && <span className="absolute top-2.5 right-2.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-forest">{quantity} in cart</span>}
      </div>
      <div className="px-1 pt-4">
        <p className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">{product.category}</p>
        <h3 className="mt-1.5 text-[15px] font-semibold">{product.name}</h3>
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-lg font-bold tracking-tight tabular-nums">{formatCurrency(product.price)}</p>
          <button type="button" onClick={onAdd} disabled={disabled} aria-label={"Add " + product.name + " to cart"} className="flex items-center gap-1.5 rounded-xl bg-sage px-3 py-2.5 text-xs font-semibold text-forest hover:bg-[#dce8c9] disabled:opacity-40">
            <Icon name="plus" width="15" height="15" /> Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
