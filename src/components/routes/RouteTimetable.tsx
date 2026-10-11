import type { Departure } from "@/types/content";

export function RouteTimetable({ departures, caption }: { departures: Departure[]; caption: string }) {
  const hasArrival = departures.some((d) => d.arrival);
  const hasDays = departures.some((d) => d.days);
  const hasFrom = departures.some((d) => d.from);
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
      <table className="w-full min-w-[28rem] border-collapse bg-white text-start text-[0.95rem]">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-paper-2 text-xs tracking-wider text-muted uppercase">
          <tr>
            <th scope="col" className="px-5 py-3.5 text-start font-medium">Départ</th>
            {hasArrival && <th scope="col" className="px-5 py-3.5 text-start font-medium">Arrivée</th>}
            {hasDays && <th scope="col" className="px-5 py-3.5 text-start font-medium">Jours</th>}
            {hasFrom && <th scope="col" className="px-5 py-3.5 text-start font-medium">Lieu de départ</th>}
          </tr>
        </thead>
        <tbody>
          {departures.map((d, i) => (
            <tr key={`${d.time}-${i}`} className="border-t border-line">
              <td className="px-5 py-4 font-[family-name:var(--font-display)] text-xl tabular-nums">{d.time}</td>
              {hasArrival && <td className="px-5 py-4 font-[family-name:var(--font-display)] text-xl tabular-nums text-muted">{d.arrival ?? "—"}</td>}
              {hasDays && <td className="px-5 py-4">{d.days ?? "—"}</td>}
              {hasFrom && <td className="px-5 py-4">{d.from ?? "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
