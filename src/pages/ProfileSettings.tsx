
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Save, Globe, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    bio: 'Digital artist exploring the intersection of technology and creativity.',
    website: 'https://johndoe.art',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    artisticMedium: 'Digital Art',
    artisticStyle: 'Surreal, Abstract',
    yearsActive: 5,
    availableForCommission: true,
    avatarUrl: ''
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy'>('profile');

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving profile:', profile);
  };

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    console.log('Upload avatar');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account and profile information</p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex border-b mb-8"
          >
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'account', label: 'Account' },
              { id: 'privacy', label: 'Privacy' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profile.avatarUrl} />
                        <AvatarFallback className="text-lg">
                          {profile.firstName[0]}{profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button onClick={handleAvatarUpload} className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Upload Photo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, State/Country"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Artistic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Artistic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="artisticMedium">Artistic Medium</Label>
                      <Input
                        id="artisticMedium"
                        value={profile.artisticMedium}
                        onChange={(e) => setProfile(prev => ({ ...prev, artisticMedium: e.target.value }))}
                        placeholder="e.g., Digital Art, Photography, Painting"
                      />
                    </div>

                    <div>
                      <Label htmlFor="artisticStyle">Artistic Style</Label>
                      <Input
                        id="artisticStyle"
                        value={profile.artisticStyle}
                        onChange={(e) => setProfile(prev => ({ ...prev, artisticStyle: e.target.value }))}
                        placeholder="e.g., Abstract, Surreal, Minimalist"
                      />
                    </div>

                    <div>
                      <Label htmlFor="yearsActive">Years Active</Label>
                      <Input
                        id="yearsActive"
                        type="number"
                        value={profile.yearsActive}
                        onChange={(e) => setProfile(prev => ({ ...prev, yearsActive: parseInt(e.target.value) }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="commissions">Available for Commissions</Label>
                        <p className="text-sm text-muted-foreground">
                          Let people know if you're accepting commission work
                        </p>
                      </div>
                      <Switch
                        id="commissions"
                        checked={profile.availableForCommission}
                        onCheckedChange={(checked) => setProfile(prev => ({ ...prev, availableForCommission: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'account' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-4">Password</h4>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      These actions are permanent and cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'privacy' && (
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Contact Information</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your contact details on your profile
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <Button onClick={handleSave} size="lg" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSettings;
