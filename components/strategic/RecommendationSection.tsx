import { TIER_UI } from '@/lib/tier-config';
import type { NegotiationSignal } from '@/lib/types';
import type { Tier, Recommendation } from '@/lib/scoring-labels';
import { RECOMMENDATION_LABELS } from '@/lib/scoring-labels';

interface RecommendationSectionProps {
  tier: Tier;
  recommendation: Recommendation;
  summary: string | null;
  suggestedQuestions: string[];
  inspectionFocus: string[];
  negotiationSignals: NegotiationSignal[];
}

/**
 * Section 6: Recommendation with action items.
 *
 * From wireframe:
 * ┌──────────────────────────────────────────┐
 * │ 🟢 "Sterke match op locatie en indeling. │
 * │     Let op erfpachtcanon bij financiering│
 * │     ."                                   │
 * │                                          │
 * │ 🗣️ VRAGEN VOOR DE MAKELAAR              │
 * │ • Wat is de erfpachtcanon na herziening? │
 * │ • Wanneer is de keuken laatst gerenoveerd│
 * │                                          │
 * │ 🔍 INSPECTIE FOCUSPUNTEN                 │
 * │ • Staat van keuken en badkamer           │
 * │ • Erfpachtvoorwaarden opvragen           │
 * │                                          │
 * │ 💪 ONDERHANDELINGSSIGNALEN               │
 * │ ┌─ Lang op de markt (92 dagen) ─────────┐│
 * │ │ Verkoper mogelijk bereid tot korting   ││
 * │ │ → Bied 5-8% onder vraagprijs          ││
 * │ └────────────────────────────────────────┘│
 * └──────────────────────────────────────────┘
 *
 * This is the "what should I DO?" section — action-oriented.
 * Server component.
 */
export function RecommendationSection(p: RecommendationSectionProps) {
  const tier = TIER_UI[p.tier];
  const rec = RECOMMENDATION_LABELS[p.recommendation];

  return (
    <div>
      {/* Recommendation quote */}
      <div
        className={`mb-6 rounded-lg px-5 py-4 ${tier.bg} border ${tier.border}`}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-lg">{tier.emoji}</span>
          <span className={`text-sm font-semibold ${tier.text}`}>
            {rec.emoji} {rec.label}
          </span>
        </div>
        {p.summary && (
          <p className="text-sm text-gray-700 leading-relaxed">
            &ldquo;{p.summary}&rdquo;
          </p>
        )}
      </div>

      {/* Questions for makelaar */}
      {p.suggestedQuestions.length > 0 && (
        <ActionList
          icon="🗣️"
          title="Vragen voor de makelaar"
          items={p.suggestedQuestions}
        />
      )}

      {/* Inspection focus */}
      {p.inspectionFocus.length > 0 && (
        <ActionList
          icon="🔍"
          title="Inspectie focuspunten"
          items={p.inspectionFocus}
        />
      )}

      {/* Negotiation signals */}
      {p.negotiationSignals.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>💪</span> Onderhandelingssignalen
          </h4>
          <div className="space-y-2">
            {p.negotiationSignals.map((signal) => (
              <div
                key={signal.signal}
                className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3"
              >
                <div className="text-sm font-medium text-gray-900">
                  {signal.signal}
                </div>
                <p className="mt-0.5 text-sm text-gray-600">{signal.detail}</p>
                <p className="mt-1 text-xs font-medium text-emerald-700">
                  → {signal.implication}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {p.suggestedQuestions.length === 0 &&
        p.inspectionFocus.length === 0 &&
        p.negotiationSignals.length === 0 && (
          <div className="text-sm text-gray-400">
            Geen specifieke actiepunten voor deze woning.
          </div>
        )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ActionList({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="mt-5">
      <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        <span>{icon}</span> {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm text-gray-700"
          >
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
