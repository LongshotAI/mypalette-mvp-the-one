
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Film, 
  Plus, 
  Edit, 
  Trash2, 
  CalendarIcon, 
  Eye, 
  Settings,
  Megaphone,
  Trophy,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { useAIFilm3 } from '@/hooks/useAIFilm3';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AIFilm3ManagementPanel = () => {
  const [activeSection, setActiveSection] = useState<'announcements' | 'config'>('announcements');
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  
  const {
    getAllAnnouncements,
    getFestivalConfig,
    createAnnouncement,
    updateAnnouncement,
    updateFestivalConfig,
    deleteAnnouncement,
  } = useAIFilm3();

  const announcements = getAllAnnouncements.data || [];
  const festivalConfig = getFestivalConfig.data;

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    announcement_type: 'general' as 'general' | 'deadline' | 'winner' | 'update',
    is_published: false,
    publish_date: new Date()
  });

  const [configForm, setConfigForm] = useState({
    festival_name: '',
    festival_description: '',
    submission_deadline: new Date(),
    festival_dates: {
      start_date: new Date(),
      end_date: new Date()
    },
    submission_guidelines: '',
    prizes: [''],
    judges: [''],
    is_active: true,
    banner_image: ''
  });

  React.useEffect(() => {
    if (festivalConfig) {
      setConfigForm({
        festival_name: festivalConfig.festival_name || '',
        festival_description: festivalConfig.festival_description || '',
        submission_deadline: new Date(festivalConfig.submission_deadline),
        festival_dates: {
          start_date: new Date(festivalConfig.festival_dates.start_date),
          end_date: new Date(festivalConfig.festival_dates.end_date)
        },
        submission_guidelines: festivalConfig.submission_guidelines || '',
        prizes: festivalConfig.prizes || [''],
        judges: festivalConfig.judges || [''],
        is_active: festivalConfig.is_active,
        banner_image: festivalConfig.banner_image || ''
      });
    }
  }, [festivalConfig]);

  const handleCreateAnnouncement = async () => {
    await createAnnouncement.mutateAsync({
      ...announcementForm,
      publish_date: announcementForm.publish_date.toISOString()
    });
    
    setAnnouncementForm({
      title: '',
      content: '',
      announcement_type: 'general',
      is_published: false,
      publish_date: new Date()
    });
    setIsCreatingAnnouncement(false);
  };

  const handleUpdateConfig = async () => {
    await updateFestivalConfig.mutateAsync({
      ...configForm,
      submission_deadline: configForm.submission_deadline.toISOString(),
      festival_dates: {
        start_date: configForm.festival_dates.start_date.toISOString(),
        end_date: configForm.festival_dates.end_date.toISOString()
      }
    });
    setIsEditingConfig(false);
  };

  const addPrize = () => {
    setConfigForm(prev => ({
      ...prev,
      prizes: [...prev.prizes, '']
    }));
  };

  const addJudge = () => {
    setConfigForm(prev => ({
      ...prev,
      judges: [...prev.judges, '']
    }));
  };

  const updatePrize = (index: number, value: string) => {
    setConfigForm(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => i === index ? value : prize)
    }));
  };

  const updateJudge = (index: number, value: string) => {
    setConfigForm(prev => ({
      ...prev,
      judges: prev.judges.map((judge, i) => i === index ? value : judge)
    }));
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case 'deadline': return 'destructive';
      case 'winner': return 'default';
      case 'update': return 'secondary';
      default: return 'outline';
    }
  };

  if (getAllAnnouncements.isLoading || getFestivalConfig.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Film className="h-6 w-6" />
            AIFilm3 Festival Management
          </h2>
          <p className="text-muted-foreground">Manage festival announcements and configuration</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeSection === 'announcements' ? 'default' : 'outline'}
            onClick={() => setActiveSection('announcements')}
            className="flex items-center gap-2"
          >
            <Megaphone className="h-4 w-4" />
            Announcements
          </Button>
          <Button
            variant={activeSection === 'config' ? 'default' : 'outline'}
            onClick={() => setActiveSection('config')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Festival Config
          </Button>
        </div>
      </div>

      {/* Announcements Section */}
      {activeSection === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Festival Announcements</h3>
            <Button 
              onClick={() => setIsCreatingAnnouncement(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Announcement
            </Button>
          </div>

          {/* Create Announcement Form */}
          {isCreatingAnnouncement && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Announcement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Announcement title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={announcementForm.announcement_type} 
                      onValueChange={(value: any) => setAnnouncementForm(prev => ({ ...prev, announcement_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="winner">Winner</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Announcement content..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={announcementForm.is_published}
                      onCheckedChange={(checked) => setAnnouncementForm(prev => ({ ...prev, is_published: checked }))}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {format(announcementForm.publish_date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={announcementForm.publish_date}
                        onSelect={(date) => date && setAnnouncementForm(prev => ({ ...prev, publish_date: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateAnnouncement} disabled={createAnnouncement.isPending}>
                    {createAnnouncement.isPending ? 'Creating...' : 'Create Announcement'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreatingAnnouncement(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcements List */}
          <div className="grid gap-4">
            {announcements.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Announcements</h3>
                  <p className="text-muted-foreground">Create your first festival announcement.</p>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {announcement.title}
                          <Badge variant={getAnnouncementTypeColor(announcement.announcement_type)}>
                            {announcement.announcement_type}
                          </Badge>
                          {announcement.is_published ? (
                            <Badge variant="default">
                              <Eye className="h-3 w-3 mr-1" />
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          By {announcement.profiles?.first_name} {announcement.profiles?.last_name} • 
                          {format(new Date(announcement.publish_date), "PPP")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteAnnouncement.mutate(announcement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Festival Configuration Section */}
      {activeSection === 'config' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Festival Configuration</h3>
            <Button 
              onClick={() => setIsEditingConfig(!isEditingConfig)}
              variant={isEditingConfig ? 'outline' : 'default'}
            >
              {isEditingConfig ? 'Cancel' : 'Edit Configuration'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Festival Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="festival_name">Festival Name</Label>
                  <Input
                    id="festival_name"
                    value={configForm.festival_name}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, festival_name: e.target.value }))}
                    disabled={!isEditingConfig}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={configForm.is_active}
                    onCheckedChange={(checked) => setConfigForm(prev => ({ ...prev, is_active: checked }))}
                    disabled={!isEditingConfig}
                  />
                  <Label htmlFor="is_active">Festival Active</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="festival_description">Festival Description</Label>
                <Textarea
                  id="festival_description"
                  value={configForm.festival_description}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, festival_description: e.target.value }))}
                  disabled={!isEditingConfig}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="submission_guidelines">Submission Guidelines</Label>
                <Textarea
                  id="submission_guidelines"
                  value={configForm.submission_guidelines}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, submission_guidelines: e.target.value }))}
                  disabled={!isEditingConfig}
                  rows={4}
                />
              </div>

              {/* Prizes Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Prizes
                  </Label>
                  {isEditingConfig && (
                    <Button size="sm" onClick={addPrize} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {configForm.prizes.map((prize, index) => (
                    <Input
                      key={index}
                      value={prize}
                      onChange={(e) => updatePrize(index, e.target.value)}
                      placeholder={`Prize ${index + 1}`}
                      disabled={!isEditingConfig}
                    />
                  ))}
                </div>
              </div>

              {/* Judges Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Judges
                  </Label>
                  {isEditingConfig && (
                    <Button size="sm" onClick={addJudge} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {configForm.judges.map((judge, index) => (
                    <Input
                      key={index}
                      value={judge}
                      onChange={(e) => updateJudge(index, e.target.value)}
                      placeholder={`Judge ${index + 1}`}
                      disabled={!isEditingConfig}
                    />
                  ))}
                </div>
              </div>

              {isEditingConfig && (
                <div className="flex gap-2">
                  <Button onClick={handleUpdateConfig} disabled={updateFestivalConfig.isPending}>
                    {updateFestivalConfig.isPending ? 'Saving...' : 'Save Configuration'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingConfig(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIFilm3ManagementPanel;
