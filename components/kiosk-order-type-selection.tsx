import Link from "next/link";
import { Brand } from "./brand";
import { Icon } from "./icon";

const orderTypes = [
  { value: "dine-in", label: "Dine In", icon: "dine" },
  { value: "take-out", label: "Take Out", icon: "bag" },
] as const;

export function KioskOrderTypeSelection() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-10 sm:py-14">
      <div className="flex justify-center text-center">
        <Brand centered />
      </div>

      <section
        aria-labelledby="order-type-heading"
        className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center py-12"
      >
        <h1 id="order-type-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
          Select order type
        </h1>

        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {orderTypes.map((option) => (
            <Link
              key={option.value}
              href={`/pos?type=${option.value}`}
              className="group flex min-h-60 flex-col items-center justify-center rounded-[28px] border-2 border-line bg-white px-8 py-10 text-center shadow-[0_14px_45px_-30px_#254d3d80] hover:border-forest hover:bg-sage"
            >
              <span className="flex size-20 items-center justify-center rounded-full bg-sage text-forest group-hover:bg-white">
                <Icon name={option.icon} width="38" height="38" />
              </span>
              <h2 className="mt-7 font-display text-3xl">{option.label}</h2>
              <span className="mt-6 flex items-center gap-2 text-sm font-semibold text-forest">
                Select <Icon name="arrow" width="18" height="18" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
