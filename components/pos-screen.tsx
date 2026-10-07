"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { categories, products, type CartItem, type OrderType, type Product, type Receipt as ReceiptData } from "@/data/products";
import { addCartItem, changeCartQuantity, getCartTotalCents, removeCartItem } from "@/utils/cart";
import { formatCurrency } from "@/utils/format";
import { validatePayment } from "@/utils/payment";
import { Brand } from "./brand";
import { Icon } from "./icon";
import { KioskOrderTypeSelection } from "./kiosk-order-type-selection";
import { ProductCard } from "./product-card";
import { Receipt } from "./receipt";

export function PosRoute() {
  const params = useSearchParams();
  const type = params.get("type");

  // A direct visit without a valid selection must still begin with order type.
  if (type !== "dine-in" && type !== "take-out") {
    return <KioskOrderTypeSelection />;
  }

  return <PosScreen key={type} orderType={type === "dine-in" ? "Dine In" : "Take Out"} />;
}

function PosScreen({ orderType }: { orderType: OrderType }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [cash, setCash] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"payment" | "confirmation" | "receipt">("payment");
  const [pendingPayment, setPendingPayment] = useState<{ paidCents: number; changeCents: number } | null>(null);
  const paymentInput = useRef<HTMLInputElement>(null);
  const modalHeading = useRef<HTMLHeadingElement>(null);
  const checkoutButton = useRef<HTMLButtonElement>(null);

  // Totals are derived on every render, never stored as separate cart state.
  const totalCents = getCartTotalCents(cart);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const filteredProducts = products.filter((product) => category === "All" || product.category === category);
  const isPaid = receipt !== null;

  useEffect(() => {
    if (!isCheckoutOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && checkoutStep === "payment") {
        setIsCheckoutOpen(false);
        requestAnimationFrame(() => checkoutButton.current?.focus());
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [checkoutStep, isCheckoutOpen]);

  useEffect(() => {
    if (isCheckoutOpen && checkoutStep === "payment") {
      paymentInput.current?.focus();
    } else if (isCheckoutOpen) {
      modalHeading.current?.focus();
    }
  }, [checkoutStep, isCheckoutOpen]);

  function addToCart(product: Product) {
    if (isPaid || isCheckoutOpen) return;
    setCart((current) => addCartItem(current, product));
    setError("");
    setAnnouncement(product.name + " added to cart.");
  }

  function updateQuantity(id: string, change: number) {
    if (isPaid || isCheckoutOpen) return;
    setCart((current) => changeCartQuantity(current, id, change));
    setError("");
  }

  function removeItem(id: string) {
    if (isPaid || isCheckoutOpen) return;
    setCart((current) => removeCartItem(current, id));
    setError("");
    setAnnouncement("Item removed from cart.");
  }

  function openCheckout() {
    if (cart.length === 0 || isPaid) return;
    setError("");
    setPendingPayment(null);
    setCheckoutStep("payment");
    setIsCheckoutOpen(true);
  }

  function closeCheckout() {
    if (checkoutStep !== "payment") return;
    setIsCheckoutOpen(false);
    requestAnimationFrame(() => checkoutButton.current?.focus());
  }

  function reviewPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPaid) return;
    if (cart.length === 0) {
      setError("Add at least one product to the cart before payment.");
      return;
    }

    const result = validatePayment(cash, totalCents);
    if (!result.valid) {
      setError(result.error);
      paymentInput.current?.focus();
      return;
    }

    setPendingPayment(result);
    setError("");
    setCheckoutStep("confirmation");
  }

  function confirmPayment() {
    if (!pendingPayment || isPaid) return;

    // Revalidate at the final action so a stale review can never create an
    // inconsistent total, payment, or change on the receipt.
    const result = validatePayment(cash, totalCents);
    if (!result.valid) {
      setError(result.error);
      setPendingPayment(null);
      setCheckoutStep("payment");
      return;
    }

    // Snapshot the paid order so its receipt cannot change with later transactions.
    setReceipt({
      reference: "CC-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
      orderType,
      items: cart.map((item) => ({ ...item })),
      totalCents,
      paidCents: result.paidCents,
      changeCents: result.changeCents,
    });
    setError("");
    setCheckoutStep("receipt");
    setAnnouncement("Payment successful. Receipt ready.");
  }

  function newTransaction() {
    setCart([]);
    setCash("");
    setReceipt(null);
    setError("");
    setPendingPayment(null);
    setCheckoutStep("payment");
    setIsCheckoutOpen(false);
    setCategory("All");
    setAnnouncement("New transaction started. Your cart is empty.");
  }

  return (
    <div className="min-h-screen">
      <div inert={isCheckoutOpen ? true : undefined} aria-hidden={isCheckoutOpen || undefined}>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Brand />
          <div className="flex items-center gap-3 sm:gap-6">
            <span className="hidden items-center gap-2 text-xs text-muted sm:flex"><span className="size-1.5 rounded-full bg-[#7c925c]" /> Campus counter</span>
            <span className="flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-xs font-semibold"><Icon name={orderType === "Dine In" ? "dine" : "bag"} width="16" height="16" />{orderType}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] items-start gap-7 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-8 2xl:grid-cols-[minmax(0,1fr)_410px]">
        <section aria-labelledby="products-heading" className="min-w-0">
          <div className="mb-7 flex items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-muted uppercase">A little something for your day</p>
              <h1 id="products-heading" className="font-display text-4xl tracking-tight">The campus essentials<span className="text-[#a37942]">.</span></h1>
              <p className="mt-2.5 text-sm text-muted">Pick your favorites. We’ll take care of the total.</p>
            </div>
            <span className="mb-1 hidden size-11 shrink-0 items-center justify-center rounded-full border border-line bg-white xl:flex"><Icon name="grid" /></span>
          </div>

          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
            {categories.map((name) => {
              const count = name === "All" ? products.length : products.filter((product) => product.category === name).length;
              return (
                <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)} className={"flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold " + (category === name ? "border-forest bg-forest text-white" : "border-line bg-white text-muted hover:border-[#b5c3a9] hover:text-forest")}>
                  {name}<span className={"rounded-full px-1.5 py-0.5 text-[10px] " + (category === name ? "bg-white/15" : "bg-background")}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.id === product.id)?.quantity ?? 0} disabled={isPaid || isCheckoutOpen} onAdd={() => addToCart(product)} />)}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs leading-5 text-muted"><Icon name="bag" width="16" height="16" />{isPaid ? "All settled! Start a new transaction for your next order." : "Add a product, then adjust its quantity in your order."}</p>
        </section>

        <aside aria-labelledby="order-heading" className="rounded-[24px] border border-line bg-white p-5 shadow-[0_8px_36px_-24px_#254d3d40] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="order-heading" className="font-display text-2xl">Your order</h2>
            <span className="rounded-full bg-background px-3 py-1.5 text-[11px] font-medium">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-background px-3.5 py-3 text-xs">
            <span className="flex items-center gap-2 font-semibold"><Icon name={orderType === "Dine In" ? "dine" : "bag"} width="17" height="17" />{orderType}</span>
            <Link href="/" onClick={newTransaction} className="text-muted underline decoration-[#bcc6b7] underline-offset-4 hover:text-forest">Change order type</Link>
          </div>

          {cart.length === 0 ? (
            <div className="my-5 flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-line px-5 text-center">
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-background text-[#8b9c7d]"><Icon name="bag" width="26" height="26" /></span>
              <h3 className="text-sm font-semibold">A little empty, for now.</h3>
              <p className="mt-2 max-w-52 text-xs leading-5 text-muted">Add something from the shelves to start your order.</p>
            </div>
          ) : (
            <ul aria-label="Cart items" className="my-4 divide-y divide-line">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <Image
                    src={item.image}
                    alt=""
                    width={80}
                    height={80}
                    className={"h-16 w-14 shrink-0 rounded-lg bg-background " + (item.imageFit === "cover" ? "object-cover" : "object-contain p-1")}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs leading-5 font-semibold">{item.name}</h3>
                      {!isPaid && !isCheckoutOpen && <button type="button" onClick={() => removeItem(item.id)} aria-label={"Remove " + item.name + " from cart"} className="-mt-1 -mr-1 rounded-md p-1.5 text-muted hover:bg-red-50 hover:text-red-700"><Icon name="trash" width="15" height="15" /></button>}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted">{formatCurrency(item.price)} each</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      {isPaid || isCheckoutOpen ? <span className="text-xs text-muted">Qty: {item.quantity}</span> : (
                        <div className="flex items-center rounded-lg border border-line">
                          <button type="button" disabled={item.quantity <= 1} onClick={() => updateQuantity(item.id, -1)} aria-label={"Decrease quantity of " + item.name} className="rounded-l-lg p-2 hover:bg-sage disabled:opacity-30"><Icon name="minus" width="13" height="13" /></button>
                          <span aria-label={"Quantity of " + item.name} className="min-w-7 text-center text-xs font-semibold tabular-nums">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={"Increase quantity of " + item.name} className="rounded-r-lg p-2 hover:bg-sage"><Icon name="plus" width="13" height="13" /></button>
                        </div>
                      )}
                      <span className="text-sm font-semibold tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-dashed border-[#d5dacd] py-5" aria-live="polite" aria-atomic="true">
            <span className="text-sm font-semibold">Total amount</span><strong className="text-2xl tracking-tight tabular-nums">{formatCurrency(totalCents / 100)}</strong>
          </div>

          {!isPaid && (
            <button
              ref={checkoutButton}
              type="button"
              onClick={openCheckout}
              disabled={cart.length === 0}
              className="flex w-full items-center justify-between rounded-xl bg-forest px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183e2d] disabled:bg-[#e4e8dd] disabled:text-[#929c89]"
            >
              Proceed to Checkout <Icon name="arrow" width="18" height="18" />
            </button>
          )}

          <button type="button" onClick={newTransaction} className={"mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold " + (isPaid ? "border-forest bg-forest text-white hover:bg-[#183e2d]" : "border-line text-muted hover:bg-background hover:text-forest")}><Icon name="refresh" width="16" height="16" />New Transaction</button>
          <p className="mt-4 text-center text-[10px] text-muted">{isPaid ? "Receipt complete · Ready for the next customer" : "A good day starts with a small stop."}</p>
        </aside>
      </main>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      <footer className="mx-auto max-w-[1600px] px-5 pt-2 pb-6 text-[10px] tracking-wide text-muted sm:px-8">CAMPUS CORNER <span className="mx-2" aria-hidden="true">/</span> Your everyday campus stop.</footer>
      </div>

      {isCheckoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#173126]/70 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCheckout();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-modal-heading"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-sage text-forest">
                  <Icon name={checkoutStep === "receipt" ? "receipt" : "cash"} width="22" height="22" />
                </span>
                <h2 ref={modalHeading} tabIndex={-1} id="checkout-modal-heading" className="font-display text-3xl outline-none">
                  {checkoutStep === "payment" && "Cash payment"}
                  {checkoutStep === "confirmation" && "Confirm amount received"}
                  {checkoutStep === "receipt" && "Digital receipt"}
                </h2>
              </div>
              {checkoutStep === "payment" && (
                <button
                  type="button"
                  onClick={closeCheckout}
                  aria-label="Close checkout"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-xl text-muted hover:bg-sage hover:text-forest"
                >
                  ×
                </button>
              )}
            </div>

            {checkoutStep === "payment" && (
              <form onSubmit={reviewPayment} noValidate className="mt-7">
                <div className="mb-6 flex items-center justify-between rounded-2xl bg-background p-4">
                  <span className="text-sm text-muted">Amount due</span>
                  <strong className="text-2xl tabular-nums">{formatCurrency(totalCents / 100)}</strong>
                </div>
                <label htmlFor="cash-amount" className="text-sm font-semibold">Amount received</label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute top-3.5 left-4 text-base text-muted" aria-hidden="true">₱</span>
                  <input
                    ref={paymentInput}
                    id="cash-amount"
                    name="cash"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={cash}
                    onChange={(event) => {
                      setCash(event.target.value);
                      setError("");
                    }}
                    placeholder="0.00"
                    autoComplete="off"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "payment-error" : "payment-help"}
                    className={"w-full rounded-xl border bg-background py-3.5 pr-4 pl-9 text-lg font-semibold tabular-nums placeholder:font-normal placeholder:text-[#9ca596] " + (error ? "border-red-500" : "border-line")}
                  />
                </div>
                {error ? (
                  <p id="payment-error" role="alert" className="mt-2 text-sm leading-5 text-red-700">{error}</p>
                ) : (
                  <p id="payment-help" className="mt-2 text-xs text-muted">Enter the cash handed to you by the customer.</p>
                )}
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <button type="button" onClick={closeCheckout} className="rounded-xl border border-line px-4 py-3.5 text-sm font-semibold text-muted hover:bg-background">Cancel</button>
                  <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183e2d]">Review Payment <Icon name="arrow" width="17" height="17" /></button>
                </div>
              </form>
            )}

            {checkoutStep === "confirmation" && pendingPayment && (
              <div className="mt-7">
                <div role="status" className="rounded-2xl border border-[#c9ddbe] bg-sage p-5 text-center">
                  <p className="text-sm text-muted">Please confirm that you received</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{formatCurrency(pendingPayment.paidCents / 100)}</p>
                  <p className="mt-2 text-sm text-muted">in cash from the customer.</p>
                </div>
                <dl className="mt-5 space-y-3 rounded-2xl border border-line p-4 text-sm tabular-nums">
                  <div className="flex justify-between"><dt className="text-muted">Order total</dt><dd className="font-semibold">{formatCurrency(totalCents / 100)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Amount received</dt><dd className="font-semibold">{formatCurrency(pendingPayment.paidCents / 100)}</dd></div>
                  <div className="flex justify-between border-t border-dashed border-line pt-3 text-base"><dt className="font-semibold">Change</dt><dd className="font-bold text-forest">{formatCurrency(pendingPayment.changeCents / 100)}</dd></div>
                </dl>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setCheckoutStep("payment")} className="rounded-xl border border-line px-4 py-3.5 text-sm font-semibold text-muted hover:bg-background">Go Back</button>
                  <button type="button" onClick={confirmPayment} className="flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183e2d]"><Icon name="check" width="17" height="17" /> Confirm Payment</button>
                </div>
              </div>
            )}

            {checkoutStep === "receipt" && receipt && (
              <div>
                <Receipt receipt={receipt} />
                <button type="button" onClick={newTransaction} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183e2d]"><Icon name="refresh" width="17" height="17" /> New Transaction</button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
