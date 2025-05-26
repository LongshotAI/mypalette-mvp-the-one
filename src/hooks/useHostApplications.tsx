
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

export const useHostApplications = () => {
  const queryClient = useQueryClient();

  const createHostApplication = useMutation({
    mutationFn: async (applicationData: HostApplicationData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('host_applications')
        .insert({
          applicant_id: user.id,
          organization_name: applicationData.organizationName,
          organization_type: applicationData.organizationType,
          website_url: applicationData.websiteUrl,
          contact_email: applicationData.contactEmail,
          phone: applicationData.phone,
          address: applicationData.address,
          proposed_title: applicationData.proposedTitle,
          proposed_description: applicationData.proposedDescription,
          proposed_theme: applicationData.proposedTheme,
          proposed_deadline: applicationData.proposedDeadline,
          proposed_exhibition_dates: applicationData.proposedExhibitionDates,
          proposed_venue: applicationData.proposedVenue,
          proposed_budget: applicationData.proposedBudget,
          proposed_prize_amount: applicationData.proposedPrizeAmount || 0,
          target_submissions: applicationData.targetSubmissions || 100,
          experience_description: applicationData.experienceDescription,
          previous_exhibitions: applicationData.previousExhibitions,
          curatorial_statement: applicationData.curatorialStatement,
          technical_requirements: applicationData.technicalRequirements,
          marketing_plan: applicationData.marketingPlan,
        })
        .select()
        .single();

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
      const { data, error } = await supabase
        .from('host_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getAllHostApplications = useQuery({
    queryKey: ['admin-host-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('host_applications')
        .select(`
          *,
          profiles(username, first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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

      const { error } = await supabase
        .from('host_applications')
        .update({
          application_status: status,
          admin_notes: notes,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', applicationId);

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
