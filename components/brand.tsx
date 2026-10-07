import { Icon } from "./icon";

export function Brand({ centered = false }: { centered?: boolean }) {
  return (
    <div className={"flex items-center gap-3 " + (centered ? "flex-col" : "")}>
      <span className={"flex items-center justify-center rounded-2xl bg-forest text-white " + (centered ? "size-16" : "size-11")}>
        <Icon name="store" width={centered ? 34 : 25} height={centered ? 34 : 25} />
      </span>
      <div>
        <p className={"font-display leading-7 tracking-tight " + (centered ? "text-3xl" : "text-[23px]")}>Campus Corner<span className="text-[#bc743d]">.</span></p>
        {!centered && <p className="text-[10px] font-semibold tracking-[0.19em] text-muted uppercase">Convenience store</p>}
      </div>
    </div>
  );
}
