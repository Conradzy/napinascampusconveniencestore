import { Icon } from "./icon";

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-forest text-white"><Icon name="store" width="25" height="25" /></span>
      <div>
        <p className="font-display text-[23px] leading-7 tracking-tight">Campus Corner<span className="text-[#bc743d]">.</span></p>
        <p className="text-[10px] font-semibold tracking-[0.19em] text-muted uppercase">Convenience store</p>
      </div>
    </div>
  );
}
