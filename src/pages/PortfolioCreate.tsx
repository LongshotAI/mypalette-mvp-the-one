
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolios } from '@/hooks/usePortfolios';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const PortfolioCreate = () => {
  const navigate = useNavigate();
  const { createPortfolio, loading } = usePortfolios();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_public: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const portfolio = await createPortfolio(formData);
      if (portfolio) {
        navigate(`/portfolio/${portfolio.id}/edit`);
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Create New Portfolio</h1>
              </div>
              <p className="text-muted-foreground">
                Create a beautiful portfolio to showcase your artistic work
              </p>
            </div>

            {/* Portfolio Creation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Portfolio Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter portfolio title"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      This will be the main title displayed on your portfolio
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your portfolio and artistic vision..."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      Provide a brief description of what visitors can expect to see
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_public">Make Portfolio Public</Label>
                      <p className="text-sm text-muted-foreground">
                        Public portfolios can be discovered and viewed by anyone
                      </p>
                    </div>
                    <Switch
                      id="is_public"
                      checked={formData.is_public}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, is_public: checked }))
                      }
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading || !formData.title.trim()}>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Create Portfolio
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Tips for Creating a Great Portfolio:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Choose a clear, descriptive title that reflects your artistic style</li>
                  <li>• Write a compelling description that tells your artistic story</li>
                  <li>• Start with your best work to make a strong first impression</li>
                  <li>• Organize your artwork in a logical, visually appealing way</li>
                  <li>• Keep your portfolio updated with your latest creations</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioCreate;
