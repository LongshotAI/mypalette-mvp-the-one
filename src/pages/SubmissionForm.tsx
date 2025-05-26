
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmissionForm = () => {
  const { callId } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost"
              onClick={() => navigate('/open-calls')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Calls
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Submit Your Artwork</h1>
              <p className="text-muted-foreground">Open Call ID: {callId}</p>
            </div>
          </div>

          {/* Open Call Info */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Digital Art Exhibition 2024</CardTitle>
                  <p className="text-muted-foreground">Organized by Modern Art Gallery</p>
                </div>
                <Badge>Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Deadline:</span>
                  <p className="text-muted-foreground">March 15, 2024</p>
                </div>
                <div>
                  <span className="font-medium">Fee:</span>
                  <p className="text-muted-foreground">$25</p>
                </div>
                <div>
                  <span className="font-medium">Max Submissions:</span>
                  <p className="text-muted-foreground">3 artworks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Submission Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Artist Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Artist Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">First Name</label>
                        <Input placeholder="Your first name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Last Name</label>
                        <Input placeholder="Your last name" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Artist Statement</label>
                      <Textarea 
                        placeholder="Tell us about your artistic practice..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Artwork Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Artwork Submission</h3>
                    
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h4 className="text-lg font-semibold mb-2">Upload Your Artwork</h4>
                      <p className="text-muted-foreground mb-4">
                        Upload up to 3 high-resolution images (JPG, PNG, max 10MB each)
                      </p>
                      <Button variant="outline">Choose Files</Button>
                    </div>
                  </div>

                  {/* Artwork Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Artwork Details</h3>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Artwork title" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea 
                        placeholder="Describe your artwork..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Medium</label>
                        <Input placeholder="e.g., Digital painting" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Year</label>
                        <Input placeholder="2024" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment & Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Submission Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Submission fee</span>
                      <span>$25.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing fee</span>
                      <span>$2.50</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>$27.50</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay & Submit
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Payment will be processed securely through Stripe
                  </p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Submission Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• High-resolution images (300 DPI minimum)</li>
                    <li>• Original artwork only</li>
                    <li>• Maximum 3 submissions per artist</li>
                    <li>• Completed by deadline</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-8 border-t mt-8">
            <h3 className="text-lg font-semibold mb-2">Full Submission System Coming Soon</h3>
            <p className="text-muted-foreground">
              Payment processing, file uploads, and submission tracking are in development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionForm;
