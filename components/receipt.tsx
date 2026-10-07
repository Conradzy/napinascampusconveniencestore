import type { Receipt as ReceiptData } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import { Icon } from "./icon";

export function Receipt({ receipt }: { receipt: ReceiptData }) {
  return (
    <section aria-labelledby="receipt-heading" className="mt-5">
      <div role="status" className="flex gap-3 rounded-2xl border border-[#c9ddbe] bg-sage p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-forest text-white"><Icon name="check" width="18" height="18" /></span>
        <div>
          <h3 className="text-sm font-semibold">Payment successful!</h3>
          <p className="mt-1 text-xs leading-5">Cash received. Your change is <strong>{formatCurrency(receipt.changeCents / 100)}</strong>.</p>
        </div>
      </div>
      <div className="receipt-paper mt-5 rounded-b-xl border-x border-b border-line bg-white px-5 pt-8 pb-5">
        <div className="text-center">
          <Icon name="receipt" className="mx-auto mb-2 text-muted" />
          <h3 id="receipt-heading" className="font-display text-xl">Campus Corner</h3>
          <p className="mt-1 text-[10px] tracking-[0.14em] text-muted uppercase">Digital receipt · Cash payment</p>
        </div>
        <dl className="my-5 space-y-2 text-xs">
          <div className="flex justify-between gap-3"><dt className="text-muted">Transaction reference</dt><dd className="text-right font-mono font-semibold">{receipt.reference}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Order type</dt><dd className="font-semibold">{receipt.orderType}</dd></div>
        </dl>
        <table className="w-full border-t border-dashed border-line text-left text-xs">
          <caption className="sr-only">Purchased items, quantities, and subtotals</caption>
          <thead><tr className="text-muted"><th scope="col" className="py-3 font-normal">Item</th><th scope="col" className="px-2 py-3 text-center font-normal">Qty</th><th scope="col" className="py-3 text-right font-normal">Subtotal</th></tr></thead>
          <tbody>{receipt.items.map((item) => <tr key={item.id}><td className="py-2 pr-1">{item.name}</td><td className="px-2 py-2 text-center tabular-nums">{item.quantity}</td><td className="py-2 text-right whitespace-nowrap tabular-nums">{formatCurrency(item.price * item.quantity)}</td></tr>)}</tbody>
        </table>
        <dl className="mt-3 space-y-3 border-t border-dashed border-line pt-4 text-xs tabular-nums">
          <div className="flex justify-between text-sm font-bold"><dt>Total amount</dt><dd>{formatCurrency(receipt.totalCents / 100)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Amount paid</dt><dd>{formatCurrency(receipt.paidCents / 100)}</dd></div>
          <div className="flex justify-between font-bold"><dt>Change</dt><dd>{formatCurrency(receipt.changeCents / 100)}</dd></div>
        </dl>
        <p className="mt-6 text-center font-display text-sm italic text-muted">Thanks for stopping by. See you around!</p>
      </div>
    </section>
  );
}
