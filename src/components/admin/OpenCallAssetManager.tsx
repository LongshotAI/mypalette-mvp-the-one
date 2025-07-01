
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, Image, Trash2, Eye } from 'lucide-react';
import HostAssetUploader from '@/components/storage/HostAssetUploader';
import { useEnhancedStorage } from '@/hooks/useEnhancedStorage';

interface OpenCallAssetManagerProps {
  openCallId?: string;
  onAssetUpdated?: (assetType: 'logo' | 'cover', url: string) => void;
}

const OpenCallAssetManager = ({ openCallId, onAssetUpdated }: OpenCallAssetManagerProps) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const { deleteFile } = useEnhancedStorage();

  const handleLogoUpload = (url: string, path: string) => {
    setLogoUrl(url);
    onAssetUpdated?.('logo', url);
  };

  const handleCoverUpload = (url: string, path: string) => {
    setCoverUrl(url);
    onAssetUpdated?.('cover', url);
  };

  const handleDeleteAsset = async (assetType: 'logo' | 'cover', path: string) => {
    try {
      await deleteFile.mutateAsync({ bucket: 'host_assets', path });
      
      if (assetType === 'logo') {
        setLogoUrl('');
        onAssetUpdated?.('logo', '');
      } else {
        setCoverUrl('');
        onAssetUpdated?.('cover', '');
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Open Call Asset Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logo">Company Logo</TabsTrigger>
            <TabsTrigger value="cover">Cover Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logo" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Current Logo</Label>
                {logoUrl ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={logoUrl} alt="Logo" className="h-12 w-12 object-cover rounded" />
                        <div>
                          <p className="text-sm font-medium">Company Logo</p>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => window.open(logoUrl, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteAsset('logo', logoUrl)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No logo uploaded</p>
                )}
              </div>
              
              <HostAssetUploader
                category="logos"
                onUploadComplete={handleLogoUpload}
                title="Upload New Logo"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="cover" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Current Cover Image</Label>
                {coverUrl ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={coverUrl} alt="Cover" className="h-12 w-20 object-cover rounded" />
                        <div>
                          <p className="text-sm font-medium">Cover Image</p>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => window.open(coverUrl, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteAsset('cover', coverUrl)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No cover image uploaded</p>
                )}
              </div>
              
              <HostAssetUploader
                category="covers"
                onUploadComplete={handleCoverUpload}
                title="Upload New Cover Image"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OpenCallAssetManager;
