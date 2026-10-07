import Image from "next/image";
import Link from "next/link";
import { Brand } from "./brand";
import { Icon } from "./icon";

export function OrderTypeSelection() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 sm:px-10">
        <Brand />
        <span className="hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-medium sm:flex"><span className="size-1.5 rounded-full bg-forest" /> Your everyday campus stop</span>
      </header>
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 py-10 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:py-16">
        <div>
          <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">A little break. A better day.</p>
          <h1 className="font-display text-5xl leading-[1.13] tracking-tight sm:text-6xl">Good things,<br />just around<br />the <span className="italic text-[#6d8055]">corner.</span></h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-muted">Your favorite snacks, refreshing sips, and school-day essentials. Let’s get your order started.</p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted"><span>Snacks & sips</span><span aria-hidden="true">✦</span><span>School essentials</span><span aria-hidden="true">✦</span><span>Made for campus life</span></div>
        </div>
        <section aria-labelledby="order-type-heading" className="overflow-hidden rounded-[32px] border border-line bg-white shadow-[0_16px_70px_-40px_#52654666]">
          <div className="selection-pattern relative flex h-44 items-center justify-center overflow-hidden bg-sage sm:h-52" aria-hidden="true">
            <div className="absolute size-64 rounded-full bg-[#d8e2c8]" />
            <Image src="/products/noodles.svg" alt="" width={150} height={150} className="relative -mr-8 -rotate-12" />
            <Image src="/products/water.svg" alt="" width={150} height={150} className="relative -mt-5 rotate-6" />
            <Image src="/products/notebook.svg" alt="" width={150} height={150} className="relative -ml-8 rotate-12" />
          </div>
          <div className="p-6 sm:p-9">
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">Welcome to Campus Corner</p>
            <h2 id="order-type-heading" className="mt-2 font-display text-3xl">How are you ordering?</h2>
            <p className="mt-2 text-sm text-muted">Choose an order type to open the counter.</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
              {([
                { value: "dine-in", label: "Dine In", description: "Stay for a little break", icon: "dine" },
                { value: "take-out", label: "Take Out", description: "Good things to go", icon: "bag" },
              ] as const).map((option) => (
                <Link key={option.value} href={"/pos?type=" + option.value} className="group rounded-2xl border border-line bg-[#fbfcf8] p-5 hover:border-forest hover:bg-sage sm:p-6">
                  <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-sage text-forest group-hover:bg-white"><Icon name={option.icon} width="25" height="25" /></span>
                  <h3 className="font-display text-2xl">{option.label}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{option.description}</p>
                  <span className="mt-5 flex items-center justify-between text-xs font-semibold text-forest">Start order<Icon name="arrow" width="18" height="18" /></span>
                </Link>
              ))}
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted"><Icon name="cash" width="16" height="16" /> Simple checkout. Cash payments only.</p>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex w-full max-w-7xl flex-wrap justify-between gap-3 px-6 py-6 text-[11px] text-muted sm:px-10"><span>Campus Corner · Snacks, sips & school essentials</span><span>A small stop for your everyday needs.</span></footer>
    </div>
  );
}
