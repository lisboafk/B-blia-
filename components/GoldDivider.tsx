export default function GoldDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40" />
      {label && (
        <span
          className="text-gold/60 text-[10px] tracking-[0.2em] uppercase px-2"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  )
}
