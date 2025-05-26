
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Film, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Users,
  Bell,
  Settings,
  BarChart
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AIFilm3AdminPanel = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Festival Registration Now Open",
      date: "2024-03-01",
      category: "Registration",
      urgent: true,
      status: "published",
      excerpt: "Submit your AI-generated films for consideration in the third annual AIFilm3 festival."
    },
    {
      id: 2,
      title: "Keynote Speaker Announcement",
      date: "2024-02-28",
      category: "Event",
      urgent: false,
      status: "published",
      excerpt: "Renowned AI researcher Dr. Sarah Chen to deliver opening keynote."
    },
    {
      id: 3,
      title: "Early Bird Pricing Extended",
      date: "2024-02-20",
      category: "Pricing",
      urgent: false,
      status: "draft",
      excerpt: "Due to popular demand, we're extending our early bird submission pricing."
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    category: 'General',
    urgent: false,
    excerpt: '',
    content: '',
    status: 'draft'
  });

  const handleCreateAnnouncement = () => {
    const announcement = {
      id: Date.now(),
      ...newAnnouncement,
      date: new Date().toISOString().split('T')[0]
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      category: 'General',
      urgent: false,
      excerpt: '',
      content: '',
      status: 'draft'
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Registration':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Event':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Pricing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* AIFilm3 Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Festival Submissions</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Artists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,341</div>
            <p className="text-xs text-muted-foreground">+89 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Next: March 15th</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Announcements</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.filter(a => a.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">{announcements.filter(a => a.urgent).length} urgent</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                AIFilm3 Announcements Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage announcements for the AIFilm3 festival
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Create a new announcement for the AIFilm3 festival website.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      placeholder="Announcement title..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newAnnouncement.category}
                        onValueChange={(value) => setNewAnnouncement({...newAnnouncement, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Registration">Registration</SelectItem>
                          <SelectItem value="Event">Event</SelectItem>
                          <SelectItem value="Pricing">Pricing</SelectItem>
                          <SelectItem value="Categories">Categories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newAnnouncement.status}
                        onValueChange={(value) => setNewAnnouncement({...newAnnouncement, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={newAnnouncement.excerpt}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, excerpt: e.target.value})}
                      placeholder="Brief summary..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      placeholder="Full announcement content..."
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={newAnnouncement.urgent}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, urgent: e.target.checked})}
                    />
                    <Label htmlFor="urgent">Mark as urgent</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement}>
                      Create Announcement
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      {announcement.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(announcement.category)}>
                        {announcement.category}
                      </Badge>
                      <Badge className={getStatusColor(announcement.status)}>
                        {announcement.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Festival Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure festival dates, submission requirements, and other settings.
            </p>
            <Button variant="outline" className="w-full">
              Manage Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed analytics for submissions, page views, and engagement.
            </p>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage festival participants, judges, and team members.
            </p>
            <Button variant="outline" className="w-full">
              Manage Participants
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Note about future integration */}
      <Card className="border-dashed">
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <Film className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">Database Integration Coming Soon</h3>
            <p className="text-sm">
              This admin panel is currently using static data. Database integration for persistent 
              announcement management will be implemented in the next phase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFilm3AdminPanel;
