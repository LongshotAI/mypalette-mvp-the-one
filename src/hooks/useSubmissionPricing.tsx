import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SubmissionPricing {
  freeRemaining: number;
  paidCount: number;
  nextSubmissionCost: number;
  canSubmit: boolean;
  totalSubmissions: number;
}

export const useSubmissionPricing = (openCallId: string) => {
  const queryClient = useQueryClient();

  // Get pricing info for current user and open call
  const getPricingInfo = useQuery({
    queryKey: ['submission-pricing', openCallId],
    queryFn: async (): Promise<SubmissionPricing> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          freeRemaining: 1,
          paidCount: 0,
          nextSubmissionCost: 0,
          canSubmit: false,
          totalSubmissions: 0
        };
      }

      console.log('Fetching submission pricing for user:', user.id, 'open call:', openCallId);

      // Call the database function to get pricing info
      const { data, error } = await supabase.rpc('get_user_submission_pricing', {
        p_user_id: user.id,
        p_open_call_id: openCallId
      });

      if (error) {
        console.error('Error fetching submission pricing:', error);
        // Default to allowing first free submission
        return {
          freeRemaining: 1,
          paidCount: 0,
          nextSubmissionCost: 0,
          canSubmit: true,
          totalSubmissions: 0
        };
      }

      const pricingData = data?.[0] || { free_remaining: 1, paid_count: 0, next_submission_cost: 0 };
      
      return {
        freeRemaining: pricingData.free_remaining || 0,
        paidCount: pricingData.paid_count || 0,
        nextSubmissionCost: pricingData.next_submission_cost || 0,
        canSubmit: pricingData.next_submission_cost !== -1, // -1 means max reached
        totalSubmissions: (1 - (pricingData.free_remaining || 0)) + (pricingData.paid_count || 0)
      };
    },
    enabled: !!openCallId,
  });

  // Update pricing after submission
  const updatePricing = useMutation({
    mutationFn: async ({ isFreebies }: { isFreebies: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Updating submission pricing:', { user: user.id, openCall: openCallId, isFree: isFreebies });

      const { error } = await supabase.rpc('update_submission_payment_tracking', {
        p_user_id: user.id,
        p_open_call_id: openCallId,
        p_is_free: isFreebies
      });

      if (error) {
        console.error('Error updating submission pricing:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch pricing info
      queryClient.invalidateQueries({ queryKey: ['submission-pricing', openCallId] });
    },
    onError: (error: any) => {
      toast({
        title: "Pricing Update Failed",
        description: error.message || "Failed to update submission pricing.",
        variant: "destructive"
      });
    }
  });

  return {
    pricingInfo: getPricingInfo.data,
    isLoadingPricing: getPricingInfo.isLoading,
    pricingError: getPricingInfo.error,
    updatePricing,
  };
};

// Helper function to format pricing display
export const formatPricingDisplay = (pricing: SubmissionPricing | undefined): string => {
  if (!pricing) return "Loading pricing...";
  
  if (pricing.freeRemaining > 0) {
    return "Free submission available";
  } else if (pricing.nextSubmissionCost > 0) {
    return `$${pricing.nextSubmissionCost} for additional submission`;
  } else if (pricing.nextSubmissionCost === -1) {
    return "Maximum submissions reached (6 total)";
  }
  return "Submission pricing unavailable";
};

export default useSubmissionPricing;