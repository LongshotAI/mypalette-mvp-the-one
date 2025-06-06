
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Film, Plus, Edit, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AIFilm3ManagementPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [announcementDialog, setAnnouncementDialog] = useState(false);
  const [festivalDialog, setFestivalDialog] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    type: 'announcement'
  });
  const [festivalData, setFestivalData] = useState({
    title: 'AIFilm3 Digital Arts Festival',
    description: 'A cutting-edge festival celebrating AI-generated art and digital creativity',
    start_date: '',
    end_date: '',
    location: 'Virtual & Global',
    submission_fee: 25
  });

  const queryClient = useQueryClient();

  // Fetch AIFilm3 announcements
  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: ['aifilm3-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education_content')
        .select('*')
        .eq('category', 'aifilm3')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  // Fetch festival info
  const { data: festivalInfo, isLoading: festivalLoading } = useQuery({
    queryKey: ['festival-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('open_calls')
        .select('*')
        .ilike('title', '%AIFilm3%')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  // Create announcement
  const createAnnouncement = useMutation({
    mutationFn: async (data: any) => {
      const { data: result, error } = await supabase
        .from('education_content')
        .insert({
          title: data.title,
          content: data.content,
          category: 'aifilm3',
          is_published: true,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-announcements'] });
      toast({
        title: "Announcement Created",
        description: "AIFilm3 announcement has been published.",
      });
      setAnnouncementDialog(false);
      setAnnouncementData({ title: '', content: '', type: 'announcement' });
    },
  });

  // Update festival info
  const updateFestivalInfo = useMutation({
    mutationFn: async (data: any) => {
      if (festivalInfo?.id) {
        const { error } = await supabase
          .from('open_calls')
          .update({
            title: data.title,
            description: data.description,
            submission_deadline: data.end_date,
            submission_fee: data.submission_fee,
            updated_at: new Date().toISOString()
          })
          .eq('id', festivalInfo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('open_calls')
          .insert({
            title: data.title,
            description: data.description,
            organization_name: 'MyPalette',
            submission_deadline: data.end_date,
            submission_fee: data.submission_fee,
            status: 'live'
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['festival-info'] });
      toast({
        title: "Festival Updated",
        description: "AIFilm3 festival information has been updated.",
      });
      setFestivalDialog(false);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Film className="h-6 w-6" />
            AIFilm3 Festival Management
          </h2>
          <p className="text-muted-foreground">Manage festival information and announcements</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={announcementDialog} onOpenChange={setAnnouncementDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create AIFilm3 Announcement</DialogTitle>
                <DialogDescription>
                  Create a new announcement for the AIFilm3 festival.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                    placeholder="Announcement title..."
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    value={announcementData.content}
                    onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
                    placeholder="Announcement content..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAnnouncementDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => createAnnouncement.mutate(announcementData)}>
                  Publish Announcement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={festivalDialog} onOpenChange={setFestivalDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Festival Info
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Festival Information</DialogTitle>
                <DialogDescription>
                  Update the AIFilm3 festival details and submission requirements.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fest-title">Festival Title</Label>
                  <Input
                    id="fest-title"
                    value={festivalData.title}
                    onChange={(e) => setFestivalData({ ...festivalData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fest-desc">Description</Label>
                  <Textarea
                    id="fest-desc"
                    rows={4}
                    value={festivalData.description}
                    onChange={(e) => setFestivalData({ ...festivalData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={festivalData.start_date}
                      onChange={(e) => setFestivalData({ ...festivalData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={festivalData.end_date}
                      onChange={(e) => setFestivalData({ ...festivalData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={festivalData.location}
                      onChange={(e) => setFestivalData({ ...festivalData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fee">Submission Fee ($)</Label>
                    <Input
                      id="fee"
                      type="number"
                      value={festivalData.submission_fee}
                      onChange={(e) => setFestivalData({ ...festivalData, submission_fee: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFestivalDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateFestivalInfo.mutate(festivalData)}>
                  Update Festival
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Festival Overview</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {festivalLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Festival Information
                </CardTitle>
                <CardDescription>Current AIFilm3 festival details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Festival Title</h4>
                      <p className="text-sm text-muted-foreground">
                        {festivalInfo?.title || 'AIFilm3 Digital Arts Festival'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {festivalInfo?.description || 'A cutting-edge festival celebrating AI-generated art and digital creativity'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Deadline: {festivalInfo?.submission_deadline ? 
                          new Date(festivalInfo.submission_deadline).toLocaleDateString() : 
                          'TBD'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Virtual & Global</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Fee: ${festivalInfo?.submission_fee || 25}</span>
                    </div>
                    <Badge variant={festivalInfo?.status === 'live' ? 'default' : 'secondary'}>
                      {festivalInfo?.status || 'Planning'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Festival Announcements</h3>
            <Badge variant="outline">{announcements?.length || 0} Announcements</Badge>
          </div>

          {announcementsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="grid gap-4">
              {announcements?.map((announcement: any) => (
                <Card key={announcement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={announcement.is_published ? 'default' : 'secondary'}>
                            {announcement.is_published ? 'Published' : 'Draft'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!announcements || announcements.length === 0) && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Announcements Yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first AIFilm3 announcement.</p>
                    <Button onClick={() => setAnnouncementDialog(true)}>
                      Create Announcement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <div className="text-center py-8">
            <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Submission Management</h3>
            <p className="text-muted-foreground">
              Festival submissions will appear here once the festival is live.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIFilm3ManagementPanel;
