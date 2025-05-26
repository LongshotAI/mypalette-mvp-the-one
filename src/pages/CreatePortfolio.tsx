
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const CreatePortfolio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPublic, setIsPublic] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: 'crestline'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Portfolio creation logic will be implemented here
    console.log('Creating portfolio:', { ...formData, isPublic });
    // For now, redirect to portfolios page
    navigate('/my-portfolios');
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground">You need to be logged in to create a portfolio.</p>
            <Button onClick={() => navigate('/auth/login')} className="mt-4">
              Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/my-portfolios')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Create New Portfolio</h1>
                <p className="text-muted-foreground">Showcase your artwork to the world</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {}}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Create Portfolio
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Portfolio Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter your portfolio title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your portfolio and artistic vision"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="template">Template</Label>
                    <Select value={formData.template} onValueChange={(value) => handleInputChange('template', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crestline">Crestline - Clean & Modern</SelectItem>
                        <SelectItem value="gallery">Gallery - Artistic Focus</SelectItem>
                        <SelectItem value="minimal">Minimal - Simple Elegance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public">Public Portfolio</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your portfolio visible to everyone
                      </p>
                    </div>
                    <Switch
                      id="public"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/30 rounded-lg flex items-center justify-center mb-4">
                    <p className="text-primary/60 text-sm">Portfolio Preview</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      {formData.title || 'Your Portfolio Title'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || 'Your portfolio description will appear here...'}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {isPublic ? 'Public' : 'Private'}
                      </span>
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                        {formData.template}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePortfolio;
