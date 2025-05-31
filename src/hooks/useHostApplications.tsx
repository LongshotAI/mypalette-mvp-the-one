
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
      console.log('Creating host application with data:', applicationData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use RPC to insert with proper typing
      const { data, error } = await supabase.rpc('create_host_application', {
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

      if (error) {
        console.error('Error creating host application:', error);
        throw error;
      }

      console.log('Host application created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-host-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-host-applications'] });
      toast({
        title: "Application Submitted",
        description: "Your host application has been submitted for review.",
      });
    },
    onError: (error: any) => {
      console.error('Host application submission error:', error);
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
      console.log('Fetching user host applications...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use RPC to get applications with proper joins
      const { data, error } = await supabase.rpc('get_user_host_applications', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching user host applications:', error);
        throw error;
      }

      console.log('User host applications fetched:', data);
      return (data || []) as HostApplication[];
    },
  });

  const getAllHostApplications = useQuery({
    queryKey: ['admin-host-applications'],
    queryFn: async () => {
      console.log('Fetching all host applications for admin...');
      
      // Use RPC to get all applications with proper joins
      const { data, error } = await supabase.rpc('get_all_host_applications');

      if (error) {
        console.error('Error fetching all host applications:', error);
        throw error;
      }

      console.log('All host applications fetched:', data);
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
      console.log('Updating host application status:', { applicationId, status, notes });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('update_host_application_status', {
        p_application_id: applicationId,
        p_status: status,
        p_notes: notes,
        p_reviewer_id: user.id
      });

      if (error) {
        console.error('Error updating host application status:', error);
        throw error;
      }

      console.log('Host application status updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-host-applications'] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating host application status:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status.",
        variant: "destructive",
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
