
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

      // Since the host_applications table doesn't exist yet, 
      // we'll store this in the open_calls table for now
      const { data, error } = await supabase
        .from('open_calls')
        .insert({
          title: applicationData.proposedTitle,
          description: applicationData.proposedDescription,
          organization_name: applicationData.organizationName,
          organization_website: applicationData.websiteUrl,
          submission_deadline: applicationData.proposedDeadline,
          submission_fee: 0,
          host_user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

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

      // Fetch from open_calls table for now
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(username, first_name, last_name)
        `)
        .eq('host_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user host applications:', error);
        throw error;
      }

      console.log('User host applications fetched:', data);
      // Transform to match HostApplication interface
      return (data || []).map(item => ({
        id: item.id,
        applicant_id: item.host_user_id || '',
        organization_name: item.organization_name || '',
        organization_type: 'gallery',
        contact_email: '',
        proposed_title: item.title,
        proposed_description: item.description,
        proposed_deadline: item.submission_deadline,
        experience_description: '',
        curatorial_statement: '',
        application_status: item.status || 'pending',
        created_at: item.created_at,
        updated_at: item.updated_at,
        profiles: item.profiles
      })) as HostApplication[];
    },
  });

  const getAllHostApplications = useQuery({
    queryKey: ['admin-host-applications'],
    queryFn: async () => {
      console.log('Fetching all host applications for admin...');
      
      // Fetch from open_calls table for now
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(username, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all host applications:', error);
        throw error;
      }

      console.log('All host applications fetched:', data);
      // Transform to match HostApplication interface
      return (data || []).map(item => ({
        id: item.id,
        applicant_id: item.host_user_id || '',
        organization_name: item.organization_name || '',
        organization_type: 'gallery',
        contact_email: '',
        proposed_title: item.title,
        proposed_description: item.description,
        proposed_deadline: item.submission_deadline,
        experience_description: '',
        curatorial_statement: '',
        application_status: item.status || 'pending',
        created_at: item.created_at,
        updated_at: item.updated_at,
        profiles: item.profiles
      })) as HostApplication[];
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
      
      const { error } = await supabase
        .from('open_calls')
        .update({ 
          status,
          admin_notes: notes 
        })
        .eq('id', applicationId);

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
