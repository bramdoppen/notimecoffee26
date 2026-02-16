import { Badge } from '@/components/ui/Badge';
import { RENOVATION_NEED_UI } from '@/lib/tier-config';
import { formatPrice } from '@/lib/format';
import { RENOVATION_CATEGORY_LABELS } from '@/lib/scoring-labels';
import type { RenovationItem } from '@/lib/types';

interface CostBreakdownProps {
  items: RenovationItem[];
  totalLow: number;
  totalMid: number;
  totalHigh: number;
  /** Show only required + recommended items in compact mode */
  compact?: boolean;
}

/**
 * Section 3: Renovation cost breakdown table.
 *
 * From wireframe:
 * ┌──────────────────────────────────────────────────────┐
 * │ Component    Urgentie     Laag    Midden    Hoog     │
 * │ Keuken       🔴 Nodig    €8.000  €12.000   €15.000  │
 * │ Badkamer     🟡 Aanbev.  €5.000  €8.000    €12.000  │
 * │ Schilderwerk 🟢 Optioneel €2.000 €3.000    €5.000   │
 * ├──────────────────────────────────────────────────────┤
 * │ TOTAAL                   €15.000 €23.000   €32.000  │
 * └──────────────────────────────────────────────────────┘
 *
 * Server component.
 */
export function CostBreakdown({
  items,
  totalLow,
  totalMid,
  totalHigh,
  compact = false,
}: CostBreakdownProps) {
  // Sort: required first, then recommended, then optional/not_needed
  const NEED_ORDER: Record<string, number> = {
    required: 0,
    recommended: 1,
    optional: 2,
    not_needed: 3,
  };

  const sorted = [...items].sort(
    (a, b) => (NEED_ORDER[a.needed] ?? 9) - (NEED_ORDER[b.needed] ?? 9),
  );

  const visible = compact
    ? sorted.filter((i) => i.needed === 'required' || i.needed === 'recommended')
    : sorted;

  if (visible.length === 0) {
    return (
      <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        ✅ Geen renovatie nodig — instapklaar
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              <th className="pb-2 pr-4">Component</th>
              <th className="pb-2 pr-4">Urgentie</th>
              <th className="pb-2 pr-4 text-right">Laag</th>
              <th className="pb-2 pr-4 text-right">Midden</th>
              <th className="pb-2 text-right">Hoog</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((item) => {
              const needConfig = RENOVATION_NEED_UI[item.needed];
              const categoryLabel =
                RENOVATION_CATEGORY_LABELS[item.category] ?? item.category;

              return (
                <tr key={item.category} className="group">
                  <td className="py-2.5 pr-4">
                    <div className="font-medium text-gray-900">
                      {categoryLabel}
                    </div>
                    {item.reasoning && (
                      <div className="mt-0.5 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.reasoning}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge
                      text={needConfig.text}
                      bg={needConfig.bg}
                      size="sm"
                    >
                      {needConfig.label}
                    </Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono text-gray-600">
                    {formatPrice(item.costLow)}
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono text-gray-900 font-medium">
                    {formatPrice(item.costMid)}
                  </td>
                  <td className="py-2.5 text-right font-mono text-gray-600">
                    {formatPrice(item.costHigh)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 font-semibold">
              <td className="pt-3 pr-4 text-gray-900" colSpan={2}>
                Totaal
              </td>
              <td className="pt-3 pr-4 text-right font-mono text-gray-600">
                {formatPrice(totalLow)}
              </td>
              <td className="pt-3 pr-4 text-right font-mono text-gray-900">
                {formatPrice(totalMid)}
              </td>
              <td className="pt-3 text-right font-mono text-gray-600">
                {formatPrice(totalHigh)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Compact mode: show hidden count */}
      {compact && sorted.length > visible.length && (
        <div className="mt-2 text-xs text-gray-400">
          + {sorted.length - visible.length} optionele items niet getoond
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-400">
        💡 Schattingen op basis van vergelijkbare woningen en marktprijzen.
        Laat altijd een bouwkundige keuring uitvoeren.
      </div>
    </div>
  );
}
