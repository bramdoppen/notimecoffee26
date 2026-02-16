import { sanityFetch } from '@/sanity/lib/fetch';
import {
  PROPERTY_WITH_ANALYSIS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import { PropertyHero } from '@/components/property/PropertyHero';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { HardCriteriaChecklist } from '@/components/scoring/HardCriteriaChecklist';
import { SoftCriteriaChart } from '@/components/scoring/SoftCriteriaChart';
import { CostBreakdown } from '@/components/renovation/CostBreakdown';
import { FinancialWaterfall } from '@/components/financial/FinancialWaterfall';
import { RiskOverview } from '@/components/risk/RiskOverview';
import { RecommendationSection } from '@/components/strategic/RecommendationSection';
import { CONDITION_UI, type Confidence } from '@/lib/tier-config';
import { formatCriteriaCount } from '@/lib/format';
import type { Metadata } from 'next';
import type { RiskLevel, BudgetStatus, Condition } from '@/lib/scoring-labels';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await sanityFetch<any>({
    query: PROPERTY_WITH_ANALYSIS_QUERY,
    params: { slug },
    tags: ['property', 'propertyAnalysis'],
  });

  if (!property) return { title: 'Woning niet gevonden' };

  const score = property.analysis?.matchScore;
  const scoreText = score != null ? ` — Score: ${score}/100` : '';

  return {
    title: `${property.address}, ${property.city}${scoreText}`,
    description: `AI-analyse van ${property.address} in ${property.city}. ${property.livingArea}m², ${property.rooms} kamers. Vraagprijs €${property.askingPrice?.toLocaleString('nl-NL')}.`,
  };
}

/**
 * Property detail page — the heart of the app.
 *
 * Fetches property + latest analysis in one GROQ query (no waterfall).
 * Renders 6 analysis sections wrapped in collapsible Section components.
 * Graceful degradation: if no analysis exists, shows property info only.
 *
 * Server component — Section collapse is the only client interaction.
 */
export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  const property = await sanityFetch<any>({
    query: PROPERTY_WITH_ANALYSIS_QUERY,
    params: { slug },
    tags: ['property', 'propertyAnalysis'],
  });

  if (!property) notFound();

  const analysis = property.analysis;

  // Derive budget status
  const budgetStatus: BudgetStatus = !analysis
    ? 'safe'
    : !analysis.withinBudget
      ? 'over_budget'
      : analysis.budgetRemaining != null &&
          analysis.totalInvestment > 0 &&
          analysis.budgetRemaining / analysis.totalInvestment < 0.05
        ? 'stretch'
        : 'safe';

  // Derive budget utilization
  const budgetUtilization =
    analysis && analysis.totalInvestment > 0
      ? Math.round(
          (analysis.totalInvestment /
            (analysis.totalInvestment + (analysis.budgetRemaining ?? 0))) *
            100,
        )
      : 0;

  // Derive investment range
  const renoLow = analysis?.totalRenovationCostLow ?? 0;
  const renoMid = analysis?.totalRenovationCostMid ?? 0;
  const renoHigh = analysis?.totalRenovationCostHigh ?? 0;
  const totalMid = analysis?.totalInvestment ?? property.askingPrice;
  const totalLow = totalMid - (renoMid - renoLow);
  const totalHigh = totalMid + (renoHigh - renoMid);

  // Derive worst risk confidence for the risk section
  const worstRiskConfidence: Confidence =
    analysis?.risks?.some((r: any) => r.confidence === 'low')
      ? 'low'
      : analysis?.risks?.some((r: any) => r.confidence === 'medium')
        ? 'medium'
        : 'high';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <PropertyHero
        address={property.address}
        city={property.city}
        zipCode={property.zipCode ?? ''}
        neighborhood={property.neighborhood?.name ?? null}
        askingPrice={property.askingPrice}
        livingArea={property.livingArea}
        rooms={property.rooms}
        bedrooms={property.bedrooms ?? 0}
        bathrooms={property.bathrooms ?? 0}
        energyLabel={property.energyLabel ?? null}
        imageUrl={property.mainImage?.asset?.url ?? null}
        fundaUrl={property.fundaUrl ?? null}
        starred={property.starred ?? false}
        matchScore={analysis?.matchScore ?? 0}
        matchTier={analysis?.tier ?? 'not_recommended'}
        recommendation={analysis?.recommendation ?? 'skip'}
        totalInvestmentLow={totalLow}
        totalInvestmentHigh={totalHigh}
        budgetStatus={budgetStatus}
        budgetUtilization={budgetUtilization}
      />

      {/* Analysis sections */}
      {analysis ? (
        <div className="mt-8 space-y-5">
          {/* Section 1: Hard Criteria */}
          <Section
            title="Harde Criteria"
            icon="📋"
            defaultOpen
            badge={
              analysis.hardCriteriaPass ? (
                <Badge text="text-emerald-700" bg="bg-emerald-50" size="sm">
                  ✅ {formatCriteriaCount(
                    analysis.hardCriteriaResults?.length ?? 0,
                    analysis.hardCriteriaResults?.length ?? 0,
                  )}
                </Badge>
              ) : (
                <Badge text="text-red-700" bg="bg-red-50" size="sm">
                  ❌ Niet voldaan
                </Badge>
              )
            }
          >
            <HardCriteriaChecklist
              results={analysis.hardCriteriaResults ?? []}
              allPass={analysis.hardCriteriaPass ?? false}
            />
          </Section>

          {/* Section 2: Soft Criteria */}
          <Section
            title="Zachte Criteria"
            icon="📊"
            badge={
              <Badge text="text-gray-600" bg="bg-gray-100" size="sm">
                {analysis.softCriteriaScore ?? 0}/100
              </Badge>
            }
          >
            <SoftCriteriaChart
              results={analysis.softCriteriaResults ?? []}
              overallScore={analysis.softCriteriaScore ?? 0}
            />
          </Section>

          {/* Section 3: Renovation */}
          <Section
            title="Renovatie Inschatting"
            icon="🔧"
            confidence={analysis.renovationConfidence ?? 'high'}
            badge={
              analysis.overallCondition ? (
                <Badge
                  text={CONDITION_UI[analysis.overallCondition as Condition]?.text ?? 'text-gray-600'}
                  bg={CONDITION_UI[analysis.overallCondition as Condition]?.bg ?? 'bg-gray-100'}
                  size="sm"
                >
                  {CONDITION_UI[analysis.overallCondition as Condition]?.label ?? analysis.overallCondition}
                </Badge>
              ) : undefined
            }
          >
            <CostBreakdown
              items={analysis.renovationBreakdown ?? []}
              totalLow={renoLow}
              totalMid={renoMid}
              totalHigh={renoHigh}
            />
          </Section>

          {/* Section 4: Financial */}
          <Section title="Financieel Overzicht" icon="💰">
            <FinancialWaterfall
              askingPrice={property.askingPrice}
              kostenKoper={analysis.kostenKoper ?? 0}
              renovationLow={renoLow}
              renovationMid={renoMid}
              renovationHigh={renoHigh}
              totalInvestment={analysis.totalInvestment ?? property.askingPrice}
              budgetStatus={budgetStatus}
              budgetUtilization={budgetUtilization}
              budgetRemaining={analysis.budgetRemaining ?? 0}
              monthlyMortgage={analysis.monthlyMortgage ?? null}
              monthlyTotal={analysis.monthlyTotal ?? null}
              erfpachtNpv={analysis.erfpachtNpv ?? null}
            />
          </Section>

          {/* Section 5: Risk Assessment */}
          <Section
            title="Risico Beoordeling"
            icon="⚠️"
            confidence={worstRiskConfidence}
          >
            <RiskOverview
              overallRisk={(analysis.overallRiskLevel as RiskLevel) ?? 'low'}
              risks={analysis.risks ?? []}
              dealbreakers={analysis.dealbreakers ?? []}
            />
          </Section>

          {/* Section 6: Recommendation */}
          <Section title="Aanbeveling" icon="💡" defaultOpen>
            <RecommendationSection
              tier={analysis.tier ?? 'not_recommended'}
              recommendation={analysis.recommendation ?? 'skip'}
              summary={analysis.summary ?? null}
              suggestedQuestions={analysis.suggestedQuestions ?? []}
              inspectionFocus={analysis.inspectionFocus ?? []}
              negotiationSignals={analysis.negotiationSignals ?? []}
            />
          </Section>
        </div>
      ) : (
        /* No analysis yet */
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 px-8 py-12 text-center">
          <div className="mb-3 text-4xl">🎯</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Nog geen AI-analyse beschikbaar
          </h3>
          <p className="max-w-md mx-auto text-sm text-gray-500">
            Deze woning is nog niet geanalyseerd. De analyse wordt automatisch
            uitgevoerd zodra het scoringsmodel actief is.
          </p>
        </div>
      )}

      {/* Property details sidebar — below analysis on mobile, could be sidebar on desktop later */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
              Kenmerken
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {property.features.map((f: string) => (
                <Badge key={f} text="text-gray-600" bg="bg-gray-100" size="sm">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Neighborhood */}
        {property.neighborhood && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
              Buurt: {property.neighborhood.name}
            </h3>
            {property.neighborhood.description && (
              <p className="mb-2 text-sm text-gray-600">
                {property.neighborhood.description}
              </p>
            )}
            {property.neighborhood.averagePricePerSqm && (
              <p className="text-sm text-gray-500">
                Gem. prijs/m²: €
                {property.neighborhood.averagePricePerSqm.toLocaleString('nl-NL')}
              </p>
            )}
          </div>
        )}

        {/* Notes */}
        {property.notes && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-600">
              📝 Notities
            </h3>
            <p className="text-sm text-amber-700 whitespace-pre-line">
              {property.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
