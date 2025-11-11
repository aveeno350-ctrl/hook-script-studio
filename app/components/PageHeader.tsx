type Props = { title: string; subtitle?: string; right?: React.ReactNode };
export default function PageHeader({ title, subtitle, right }: Props) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-black/35 bg-black/20 border-b border-white/10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <div className="kicker">Hook Script Studio</div>
          <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[color:var(--muted)] mt-1">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
