
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface HostApplicationData {
  organizationName: string;
  organizationType: string;
  websiteUrl?: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  proposedTitle: string;
  proposedDescription: string;
  proposedTheme?: string;
  proposedDeadline: string;
  proposedExhibitionDates?: string;
  proposedVenue?: string;
  proposedBudget?: number;
  proposedPrizeAmount?: number;
  targetSubmissions?: number;
  experienceDescription: string;
  previousExhibitions?: string;
  curatorialStatement: string;
  technicalRequirements?: string;
  marketingPlan?: string;
}

export interface HostApplication {
  id: string;
  applicant_id: string;
  organization_name: string;
  organization_type: string;
  website_url?: string;
  contact_email: string;
  phone?: string;
  address?: string;
  proposed_title: string;
  proposed_description: string;
  proposed_theme?: string;
  proposed_deadline: string;
  proposed_exhibition_dates?: string;
  proposed_venue?: string;
  proposed_budget?: number;
  proposed_prize_amount?: number;
  target_submissions?: number;
  experience_description: string;
  previous_exhibitions?: string;
  curatorial_statement: string;
  technical_requirements?: string;
  marketing_plan?: string;
  application_status: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    first_name?: string;
    last_name?: string;
  };
}

export const useHostApplications = () => {
  const queryClient = useQueryClient();

  const createHostApplication = useMutation({
    mutationFn: async (applicationData: HostApplicationData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use raw SQL to call the function directly with proper type casting
      const { data, error } = await supabase.rpc('create_host_application' as any, {
        p_applicant_id: user.id,
        p_organization_name: applicationData.organizationName,
        p_organization_type: applicationData.organizationType,
        p_website_url: applicationData.websiteUrl,
        p_contact_email: applicationData.contactEmail,
        p_phone: applicationData.phone,
        p_address: applicationData.address,
        p_proposed_title: applicationData.proposedTitle,
        p_proposed_description: applicationData.proposedDescription,
        p_proposed_theme: applicationData.proposedTheme,
        p_proposed_deadline: applicationData.proposedDeadline,
        p_proposed_exhibition_dates: applicationData.proposedExhibitionDates,
        p_proposed_venue: applicationData.proposedVenue,
        p_proposed_budget: applicationData.proposedBudget,
        p_proposed_prize_amount: applicationData.proposedPrizeAmount || 0,
        p_target_submissions: applicationData.targetSubmissions || 100,
        p_experience_description: applicationData.experienceDescription,
        p_previous_exhibitions: applicationData.previousExhibitions,
        p_curatorial_statement: applicationData.curatorialStatement,
        p_technical_requirements: applicationData.technicalRequirements,
        p_marketing_plan: applicationData.marketingPlan
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-applications'] });
      toast({
        title: "Application Submitted",
        description: "Your host application has been submitted for review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application.",
        variant: "destructive",
      });
    },
  });

  const getUserHostApplications = useQuery({
    queryKey: ['user-host-applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_user_host_applications' as any, {
        p_user_id: user.id
      });

      if (error) throw error;
      return (data || []) as HostApplication[];
    },
  });

  const getAllHostApplications = useQuery({
    queryKey: ['admin-host-applications'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_host_applications' as any, {});

      if (error) throw error;
      return (data || []) as HostApplication[];
    },
  });

  const updateHostApplicationStatus = useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      notes 
    }: { 
      applicationId: string; 
      status: string; 
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('update_host_application_status' as any, {
        p_application_id: applicationId,
        p_status: status,
        p_notes: notes,
        p_reviewer_id: user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-host-applications'] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated.",
      });
    },
  });

  return {
    createHostApplication,
    getUserHostApplications,
    getAllHostApplications,
    updateHostApplicationStatus,
  };
};
