
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, DollarSign, Calendar, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmissionForm = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState({
    artworkTitle: '',
    artworkDescription: '',
    artistStatement: '',
    submissionNotes: ''
  });

  // Mock open call data
  const openCall = {
    title: 'Digital Futures Exhibition',
    organization: 'Modern Art Gallery',
    submissionFee: 25,
    deadline: '2024-03-15',
    requirements: [
      'Digital artwork only',
      'High resolution images (300 DPI minimum)',
      'Maximum file size: 50MB',
      'Artist statement required'
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic
    console.log('Submitting to call:', callId, submission);
    navigate('/open-calls');
  };

  const handleBack = () => {
    navigate(`/open-calls/${callId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Submit Your Work</h1>
              <p className="text-muted-foreground">Submit to: {openCall.title}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Artwork Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="artworkTitle">Artwork Title *</Label>
                      <Input
                        id="artworkTitle"
                        value={submission.artworkTitle}
                        onChange={(e) => setSubmission(prev => ({ ...prev, artworkTitle: e.target.value }))}
                        placeholder="Enter artwork title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="artworkDescription">Artwork Description *</Label>
                      <Textarea
                        id="artworkDescription"
                        value={submission.artworkDescription}
                        onChange={(e) => setSubmission(prev => ({ ...prev, artworkDescription: e.target.value }))}
                        placeholder="Describe your artwork"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="files">Upload Artwork *</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your files here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Select Files
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Artist Statement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="artistStatement">Artist Statement *</Label>
                      <Textarea
                        id="artistStatement"
                        value={submission.artistStatement}
                        onChange={(e) => setSubmission(prev => ({ ...prev, artistStatement: e.target.value }))}
                        placeholder="Provide context about your work and artistic practice"
                        rows={6}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="submissionNotes">Submission Notes (Optional)</Label>
                      <Textarea
                        id="submissionNotes"
                        value={submission.submissionNotes}
                        onChange={(e) => setSubmission(prev => ({ ...prev, submissionNotes: e.target.value }))}
                        placeholder="Any additional information you'd like to include"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button type="submit" size="lg" className="flex-1">
                    Submit Artwork
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                    Save Draft
                  </Button>
                </div>
              </motion.form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Submission Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Fee: ${openCall.submissionFee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Deadline: {openCall.deadline}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {openCall.requirements.map((req, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionForm;
