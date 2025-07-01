
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Film, 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Megaphone,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { useAIFilm3 } from '@/hooks/useAIFilm3';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AIFilm3ManagementPanel = () => {
  const [activeSection, setActiveSection] = useState<'announcements' | 'config'>('announcements');
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);
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
  const festivalConfig = getFestivalConfig.data || [];

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
  });

  const [configForm, setConfigForm] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (festivalConfig.length > 0) {
      const configObj = festivalConfig.reduce((acc, config) => {
        acc[config.key] = config.value;
        return acc;
      }, {} as Record<string, string>);
      setConfigForm(configObj);
    }
  }, [festivalConfig]);

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      return;
    }

    await createAnnouncement.mutateAsync(announcementForm);
    
    setAnnouncementForm({ title: '', content: '' });
    setIsCreatingAnnouncement(false);
  };

  const handleUpdateAnnouncement = async (id: string) => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      return;
    }

    await updateAnnouncement.mutateAsync({
      id,
      ...announcementForm,
    });
    
    setAnnouncementForm({ title: '', content: '' });
    setEditingAnnouncement(null);
  };

  const handleEditAnnouncement = (announcement: any) => {
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
    });
    setEditingAnnouncement(announcement.id);
    setIsCreatingAnnouncement(false);
  };

  const handleUpdateConfig = async () => {
    await updateFestivalConfig.mutateAsync(configForm);
    setIsEditingConfig(false);
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfigForm(prev => ({
      ...prev,
      [key]: value,
    }));
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
              onClick={() => {
                setIsCreatingAnnouncement(true);
                setEditingAnnouncement(null);
                setAnnouncementForm({ title: '', content: '' });
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Announcement
            </Button>
          </div>

          {/* Create/Edit Announcement Form */}
          {(isCreatingAnnouncement || editingAnnouncement) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Announcement content..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => editingAnnouncement ? handleUpdateAnnouncement(editingAnnouncement) : handleCreateAnnouncement()}
                    disabled={createAnnouncement.isPending || updateAnnouncement.isPending}
                  >
                    {(createAnnouncement.isPending || updateAnnouncement.isPending) 
                      ? (editingAnnouncement ? 'Updating...' : 'Creating...') 
                      : (editingAnnouncement ? 'Update Announcement' : 'Create Announcement')
                    }
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreatingAnnouncement(false);
                      setEditingAnnouncement(null);
                      setAnnouncementForm({ title: '', content: '' });
                    }}
                  >
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
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(announcement.created_at), "PPP")}
                          </Badge>
                        </CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditAnnouncement(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteAnnouncement.mutate(announcement.id)}
                          disabled={deleteAnnouncement.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
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
            <CardContent className="space-y-4">
              {Object.entries(configForm).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    id={key}
                    value={value}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    disabled={!isEditingConfig}
                  />
                </div>
              ))}

              {isEditingConfig && (
                <div className="flex gap-2 pt-4">
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
