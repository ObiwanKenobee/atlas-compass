import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["financial_metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_metrics")
        .select("*")
        .order("metric_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useInvestorUpdates() {
  return useQuery({
    queryKey: ["investor_updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investor_updates")
        .select("*")
        .order("update_date", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useRevenueStreams() {
  return useQuery({
    queryKey: ["revenue_streams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_streams")
        .select("*")
        .order("metric_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCostStructure() {
  return useQuery({
    queryKey: ["cost_structure"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cost_structure")
        .select("*")
        .order("metric_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
