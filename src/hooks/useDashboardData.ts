import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useInvestorProfile() {
  return useQuery({
    queryKey: ["investor_profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("investor_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: { firm_name?: string; full_name?: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("investor_profiles")
        .update(updates)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["investor_profile"] }),
  });
}

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

export function useUpdateMetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Record<string, number>) => {
      const { data: existing } = await supabase
        .from("financial_metrics")
        .select("id")
        .order("metric_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!existing) throw new Error("No metrics row found");
      const { error } = await supabase
        .from("financial_metrics")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["financial_metrics"] }),
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

export function useMetricsHistory(from?: Date, to?: Date) {
  return useQuery({
    queryKey: ["metrics_history", from?.toISOString(), to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from("metrics_history")
        .select("*")
        .order("metric_date", { ascending: true });
      if (from) query = query.gte("metric_date", from.toISOString().slice(0, 10));
      if (to) query = query.lte("metric_date", to.toISOString().slice(0, 10));
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}
