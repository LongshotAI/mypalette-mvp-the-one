
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, MoreVertical, BookOpen, Eye, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface EducationContent {
  id: string;
  title: string;
  category: string;
  author: string;
  status: 'published' | 'draft' | 'pending';
  views: number;
  publishedDate: string;
  lastModified: string;
}

const AdminEducation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');

  const mockContent: EducationContent[] = [
    {
      id: '1',
      title: 'Getting Started with Digital Art',
      category: 'Digital Art',
      author: 'Sarah Johnson',
      status: 'published',
      views: 1247,
      publishedDate: '2024-01-15',
      lastModified: '2024-01-20'
    },
    {
      id: '2',
      title: 'Color Theory for Artists',
      category: 'Art Theory',
      author: 'Mike Chen',
      status: 'published',
      views: 892,
      publishedDate: '2024-02-01',
      lastModified: '2024-02-05'
    },
    {
      id: '3',
      title: 'Building Your Portfolio',
      category: 'Portfolio',
      author: 'Elena Rodriguez',
      status: 'draft',
      views: 0,
      publishedDate: '',
      lastModified: '2024-02-20'
    },
    {
      id: '4',
      title: 'Marketing Your Art Online',
      category: 'Business',
      author: 'Alex Thompson',
      status: 'pending',
      views: 0,
      publishedDate: '',
      lastModified: '2024-02-18'
    }
  ];

  const categories = ['all', 'Digital Art', 'Art Theory', 'Portfolio', 'Business'];

  const filteredContent = mockContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePublish = (id: string) => {
    console.log('Publishing content:', id);
  };

  const handleUnpublish = (id: string) => {
    console.log('Unpublishing content:', id);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Education Content Management</h1>
              <p className="text-muted-foreground">Create and manage educational content</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search content by title or author..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Content ({filteredContent.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title & Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <Badge variant="secondary" className="mt-1">
                              {content.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <User className="h-3 w-3 mr-1" />
                            {content.author}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(content.status)}`}></div>
                            <Badge variant={getStatusVariant(content.status)}>
                              {content.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Eye className="h-3 w-3 mr-1" />
                            {content.views.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {content.publishedDate ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {content.publishedDate}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not published</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {content.lastModified}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {content.status === 'published' ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUnpublish(content.id)}
                              >
                                Unpublish
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handlePublish(content.id)}
                              >
                                Publish
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Content</p>
                    <p className="text-2xl font-bold">{mockContent.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold">
                      {mockContent.filter(c => c.status === 'published').length}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold">
                      {mockContent.filter(c => c.status === 'pending').length}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">
                      {mockContent.reduce((sum, content) => sum + content.views, 0).toLocaleString()}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminEducation;
