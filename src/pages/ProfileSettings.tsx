
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Camera, Globe, Phone, MapPin, Palette } from 'lucide-react';

const ProfileSettings = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="artistic">Artistic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended size: 400x400px
                      </p>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Your last name" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="@username" />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Artistic Information */}
            <TabsContent value="artistic">
              <Card>
                <CardHeader>
                  <CardTitle>Artistic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medium">Artistic Medium</Label>
                      <Input id="medium" placeholder="e.g., Digital Art, Photography" />
                    </div>
                    <div>
                      <Label htmlFor="style">Artistic Style</Label>
                      <Input id="style" placeholder="e.g., Abstract, Realism" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="yearsActive">Years Active</Label>
                    <Input id="yearsActive" type="number" placeholder="How many years have you been creating art?" />
                  </div>

                  <div>
                    <Label htmlFor="statement">Artist Statement</Label>
                    <Textarea 
                      id="statement" 
                      placeholder="Your artistic philosophy and approach..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea 
                      id="education" 
                      placeholder="Your artistic education and training..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="awards">Awards</Label>
                      <Textarea 
                        id="awards" 
                        placeholder="List your awards and recognition..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exhibitions">Exhibitions</Label>
                      <Textarea 
                        id="exhibitions" 
                        placeholder="List your exhibitions and shows..."
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                        <Globe className="h-4 w-4" />
                      </span>
                      <Input 
                        id="website" 
                        placeholder="https://yourwebsite.com"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                        <Phone className="h-4 w-4" />
                      </span>
                      <Input 
                        id="phone" 
                        placeholder="+1 (555) 123-4567"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <Input 
                        id="location" 
                        placeholder="City, Country"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="commission">Commission Information</Label>
                    <Textarea 
                      id="commission" 
                      placeholder="Information about commissions, rates, and availability..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pricing">Pricing Information</Label>
                    <Textarea 
                      id="pricing" 
                      placeholder="Your pricing structure and rates..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-muted-foreground">
                          Control who can see your profile
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Public</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Commission Availability</h4>
                        <p className="text-sm text-muted-foreground">
                          Show that you're available for commissions
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Available</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Contact Information</h4>
                        <p className="text-sm text-muted-foreground">
                          Control who can see your contact details
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Members Only</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button size="lg">
              <Palette className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-8 border-t mt-8">
            <h3 className="text-lg font-semibold mb-2">Profile System Coming Soon</h3>
            <p className="text-muted-foreground">
              Full profile management with social links, portfolio integration, and advanced privacy controls.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSettings;
