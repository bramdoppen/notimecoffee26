import { Badge } from '@/components/ui/Badge';
import { BUDGET_UI } from '@/lib/tier-config';
import { formatPrice, formatPercentage } from '@/lib/format';
import type { BudgetStatus } from '@/lib/scoring-labels';

interface FinancialWaterfallProps {
  askingPrice: number;
  kostenKoper: number;
  renovationLow: number;
  renovationMid: number;
  renovationHigh: number;
  totalInvestment: number;
  budgetStatus: BudgetStatus;
  budgetUtilization: number;
  budgetRemaining: number;
  monthlyMortgage: number | null;
  monthlyTotal: number | null;
  erfpachtNpv: number | null;
}

/**
 * Section 4: Financial waterfall / cost stack.
 *
 * From wireframe:
 * ┌──────────────────────────────────────────┐
 * │ Vraagprijs           €350.000            │
 * │ + Kosten koper       €21.000             │
 * │ + Renovatie (midden) €23.000             │
 * │ ═══════════════════════════════           │
 * │ Totale investering   €394.000            │
 * │                                          │
 * │ ████████████████████████░░░░  94% budget │
 * │ ✅ Binnen budget — €26.000 over          │
 * └──────────────────────────────────────────┘
 *
 * Server component.
 */
export function FinancialWaterfall(p: FinancialWaterfallProps) {
  const budget = BUDGET_UI[p.budgetStatus];

  return (
    <div>
      {/* Cost stack */}
      <div className="space-y-2 text-sm">
        <CostRow label="Vraagprijs" amount={p.askingPrice} />
        <CostRow label="+ Kosten koper (k.k.)" amount={p.kostenKoper} muted />
        <CostRow
          label="+ Renovatie (midden)"
          amount={p.renovationMid}
          muted
          sublabel={
            p.renovationLow !== p.renovationHigh
              ? `Range: ${formatPrice(p.renovationLow)} – ${formatPrice(p.renovationHigh)}`
              : undefined
          }
        />
        {p.erfpachtNpv != null && p.erfpachtNpv > 0 && (
          <CostRow
            label="+ Erfpacht (contante waarde)"
            amount={p.erfpachtNpv}
            muted
          />
        )}

        {/* Divider */}
        <div className="border-t-2 border-gray-300 pt-2">
          <CostRow
            label="Totale investering"
            amount={p.totalInvestment}
            bold
          />
        </div>
      </div>

      {/* Budget bar */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span>Budget benutting</span>
          <span className="font-semibold text-gray-900">
            {formatPercentage(p.budgetUtilization)}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBudgetBarColor(p.budgetStatus)}`}
            style={{ width: `${Math.min(p.budgetUtilization, 100)}%` }}
            role="progressbar"
            aria-valuenow={p.budgetUtilization}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Budget benutting"
          />
        </div>
        {p.budgetUtilization > 100 && (
          <div
            className="mt-1 h-1 rounded-full bg-red-400"
            style={{ width: `${Math.min(p.budgetUtilization - 100, 30)}%` }}
            aria-hidden
          />
        )}
      </div>

      {/* Budget status */}
      <div className="mt-3 flex items-center gap-2">
        <Badge text={budget.text} bg={budget.bg} size="sm">
          {budget.icon} {budget.label}
        </Badge>
        <span className="text-sm text-gray-500">
          {p.budgetRemaining >= 0
            ? `${formatPrice(p.budgetRemaining)} over`
            : `${formatPrice(Math.abs(p.budgetRemaining))} over budget`}
        </span>
      </div>

      {/* Monthly costs */}
      {(p.monthlyMortgage != null || p.monthlyTotal != null) && (
        <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">
            Maandlasten (indicatief)
          </div>
          <div className="space-y-1 text-sm">
            {p.monthlyMortgage != null && (
              <div className="flex justify-between">
                <span className="text-gray-500">Hypotheek</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(p.monthlyMortgage)}/mnd
                </span>
              </div>
            )}
            {p.monthlyTotal != null && (
              <div className="flex justify-between">
                <span className="text-gray-500">Totaal woonlasten</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(p.monthlyTotal)}/mnd
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CostRow({
  label,
  amount,
  muted = false,
  bold = false,
  sublabel,
}: {
  label: string;
  amount: number;
  muted?: boolean;
  bold?: boolean;
  sublabel?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span
          className={
            bold
              ? 'font-semibold text-gray-900'
              : muted
                ? 'text-gray-500'
                : 'text-gray-700'
          }
        >
          {label}
        </span>
        <span
          className={`font-mono ${bold ? 'text-lg font-bold text-gray-900' : muted ? 'text-gray-500' : 'font-medium text-gray-900'}`}
        >
          {formatPrice(amount)}
        </span>
      </div>
      {sublabel && (
        <div className="text-right text-xs text-gray-400">{sublabel}</div>
      )}
    </div>
  );
}

function getBudgetBarColor(status: BudgetStatus): string {
  switch (status) {
    case 'safe':
      return 'bg-emerald-500';
    case 'stretch':
      return 'bg-amber-500';
    case 'over_budget':
      return 'bg-red-500';
  }
}
