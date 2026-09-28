export default function CategoryRail({ categories, active, onSelect, counts }) {
  const tabs = [{ _id: 'all', name: 'Everything' }, ...categories];

  return (
    <div className="no-scrollbar fade-right flex gap-2 overflow-x-auto pb-1">
      {tabs.map((cat) => {
        const selected = active === cat._id;
        const count = counts?.[cat._id];

        return (
          <button
            key={cat._id}
            onClick={() => onSelect(cat._id)}
            aria-pressed={selected}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-all duration-200 active:scale-95 ${
              selected
                ? 'bg-ink font-semibold text-ground'
                : 'border border-line bg-raised text-ink-dim hover:border-ink-faint hover:text-ink'
            }`}
          >
            {cat.name}
            {count != null && (
              <span
                className={`text-xs tabular-nums ${selected ? 'text-ground/55' : 'text-ink-faint'}`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
