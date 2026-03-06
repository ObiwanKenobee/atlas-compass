-- Financial metrics table for Atlas Sanctum dashboard
CREATE TABLE public.financial_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  burn_rate NUMERIC(12, 2) NOT NULL DEFAULT 284000,
  cash_on_hand NUMERIC(14, 2) NOT NULL DEFAULT 5400000,
  mrr NUMERIC(12, 2) NOT NULL DEFAULT 142000,
  mrr_growth_percent NUMERIC(6, 2) NOT NULL DEFAULT 11.8,
  runway_months INTEGER NOT NULL DEFAULT 19,
  cac NUMERIC(10, 2) NOT NULL DEFAULT 5700,
  ltv NUMERIC(12, 2) NOT NULL DEFAULT 284000,
  revenue_per_employee NUMERIC(10, 2) NOT NULL DEFAULT 9467,
  headcount INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.revenue_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  verification_api NUMERIC(12, 2) NOT NULL DEFAULT 52000,
  enterprise_simulations NUMERIC(12, 2) NOT NULL DEFAULT 38000,
  marketplace_fees NUMERIC(12, 2) NOT NULL DEFAULT 29000,
  gov_institutional NUMERIC(12, 2) NOT NULL DEFAULT 23000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.cost_structure (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  engineering_infra NUMERIC(12, 2) NOT NULL DEFAULT 95000,
  data_acquisition NUMERIC(12, 2) NOT NULL DEFAULT 62000,
  operations_team NUMERIC(12, 2) NOT NULL DEFAULT 54000,
  research_modeling NUMERIC(12, 2) NOT NULL DEFAULT 42000,
  partnerships_field NUMERIC(12, 2) NOT NULL DEFAULT 31000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.investor_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  update_date DATE NOT NULL DEFAULT CURRENT_DATE,
  update_type TEXT NOT NULL CHECK (update_type IN ('product', 'partnership', 'data', 'verification')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.financial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financial metrics are publicly readable" ON public.financial_metrics FOR SELECT USING (true);
CREATE POLICY "Revenue streams are publicly readable" ON public.revenue_streams FOR SELECT USING (true);
CREATE POLICY "Cost structure is publicly readable" ON public.cost_structure FOR SELECT USING (true);
CREATE POLICY "Investor updates are publicly readable" ON public.investor_updates FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_financial_metrics_updated_at
  BEFORE UPDATE ON public.financial_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.financial_metrics (metric_date, burn_rate, cash_on_hand, mrr, mrr_growth_percent, runway_months, cac, ltv, revenue_per_employee, headcount)
VALUES (CURRENT_DATE, 284000, 5400000, 142000, 11.8, 19, 5700, 284000, 9467, 15);

INSERT INTO public.revenue_streams (metric_date, verification_api, enterprise_simulations, marketplace_fees, gov_institutional)
VALUES (CURRENT_DATE, 52000, 38000, 29000, 23000);

INSERT INTO public.cost_structure (metric_date, engineering_infra, data_acquisition, operations_team, research_modeling, partnerships_field)
VALUES (CURRENT_DATE, 95000, 62000, 54000, 42000, 31000);

INSERT INTO public.investor_updates (update_date, update_type, title, description) VALUES
  ('2025-03-03', 'product', 'Carbon Credit API v2.1 Released', 'Enhanced verification endpoints now process 10x more transactions per second.'),
  ('2025-02-24', 'partnership', 'Partnership: Veridian Capital Group', '3-year enterprise contract for regenerative land intelligence data feeds.'),
  ('2025-02-14', 'data', 'Sentinel-2 Satellite Integration', 'Real-time hyperspectral imagery now powers ecosystem health scoring.'),
  ('2025-01-29', 'verification', '12,400 Hectares Certified', 'Amazon biome corridor verified and listed on the Regenerative Marketplace.'),
  ('2025-01-12', 'product', 'Government Dashboard Launched', 'Public sector portal for Brazil MMA now live with biodiversity indexes.');