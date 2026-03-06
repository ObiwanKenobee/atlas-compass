-- Add UPDATE policies so founders can edit metrics
CREATE POLICY "Financial metrics are editable" ON public.financial_metrics FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Revenue streams are editable" ON public.revenue_streams FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Cost structure is editable" ON public.cost_structure FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Investor updates are editable" ON public.investor_updates FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Investor updates are insertable" ON public.investor_updates FOR INSERT WITH CHECK (true);

-- Historical metrics table for 12-month trend data
CREATE TABLE public.metrics_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL,
  burn_rate NUMERIC(12, 2) NOT NULL,
  mrr NUMERIC(12, 2) NOT NULL,
  cac NUMERIC(10, 2) NOT NULL,
  cash_on_hand NUMERIC(14, 2) NOT NULL,
  runway_months INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.metrics_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Metrics history is publicly readable" ON public.metrics_history FOR SELECT USING (true);
CREATE POLICY "Metrics history is editable" ON public.metrics_history FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Metrics history is insertable" ON public.metrics_history FOR INSERT WITH CHECK (true);

-- Seed 12 months of historical data
INSERT INTO public.metrics_history (metric_date, burn_rate, mrr, cac, cash_on_hand, runway_months) VALUES
  ('2024-04-01', 430000, 62000, 11200, 7200000, 16),
  ('2024-05-01', 415000, 71000, 10800, 7050000, 16),
  ('2024-06-01', 398000, 79000, 10100, 6890000, 17),
  ('2024-07-01', 380000, 88000, 9600, 6720000, 17),
  ('2024-08-01', 362000, 97000, 8900, 6540000, 18),
  ('2024-09-01', 350000, 104000, 8300, 6350000, 18),
  ('2024-10-01', 340000, 112000, 7800, 6150000, 18),
  ('2024-11-01', 330000, 118000, 7200, 5980000, 18),
  ('2024-12-01', 318000, 123000, 6800, 5810000, 18),
  ('2025-01-01', 312000, 127000, 6400, 5650000, 18),
  ('2025-02-01', 298000, 134000, 6000, 5530000, 18),
  ('2025-03-01', 284000, 142000, 5700, 5400000, 19);