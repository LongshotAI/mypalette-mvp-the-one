import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Search, Filter, Building, Mail, Phone, MapPin, Calendar, DollarSign, Users, Eye } from 'lucide-react';
import { useHostApplications, type HostApplication } from '@/hooks/useHostApplications';

const AdminHostApplications = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<HostApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { getAllHostApplications, updateHostApplicationStatus } = useHostApplications();
  const { data: applications, isLoading } = getAllHostApplications;

  const filteredApplications = applications?.filter(app => {
    const matchesSearch = 
      app.organization_name.toLowerCase().includes(search.toLowerCase()) ||
      app.proposed_title.toLowerCase().includes(search.toLowerCase()) ||
      app.contact_email.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || app.application_status === filter;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'under_review': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'requires_revision': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusUpdate = (applicationId: string, status: string, notes?: string) => {
    updateHostApplicationStatus.mutate({
      applicationId,
      status,
      notes
    });
    setAdminNotes('');
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Host Applications</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="requires_revision">Needs Revision</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {application.proposed_title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {application.organization_name} ({application.organization_type})
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {application.contact_email}
                    </span>
                    {application.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {application.phone}
                      </span>
                    )}
                  </div>
                  {application.profiles && (
                    <p className="text-sm text-gray-500">
                      Applied by: {application.profiles.first_name} {application.profiles.last_name} 
                      ({application.profiles.username})
                    </p>
                  )}
                </div>
                <Badge className={getStatusColor(application.application_status)}>
                  {application.application_status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 line-clamp-2">
                {application.proposed_description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span>Deadline: {new Date(application.proposed_deadline).toLocaleDateString()}</span>
                </div>
                {application.proposed_budget && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span>Budget: ${application.proposed_budget.toLocaleString()}</span>
                  </div>
                )}
                {application.proposed_prize_amount && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span>Prize: ${application.proposed_prize_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-gray-500" />
                  <span>Target: {application.target_submissions} submissions</span>
                </div>
              </div>

              {application.proposed_venue && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{application.proposed_venue}</span>
                </div>
              )}

              {application.admin_notes && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Admin Notes:</strong> {application.admin_notes}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{application.proposed_title}</DialogTitle>
                    </DialogHeader>
                    {selectedApplication && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Organization Details</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Name:</strong> {selectedApplication.organization_name}</p>
                              <p><strong>Type:</strong> {selectedApplication.organization_type}</p>
                              <p><strong>Website:</strong> {selectedApplication.website_url || 'Not provided'}</p>
                              <p><strong>Email:</strong> {selectedApplication.contact_email}</p>
                              <p><strong>Phone:</strong> {selectedApplication.phone || 'Not provided'}</p>
                              <p><strong>Address:</strong> {selectedApplication.address || 'Not provided'}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Proposed Open Call</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Theme:</strong> {selectedApplication.proposed_theme || 'Not specified'}</p>
                              <p><strong>Deadline:</strong> {new Date(selectedApplication.proposed_deadline).toLocaleDateString()}</p>
                              <p><strong>Exhibition Dates:</strong> {selectedApplication.proposed_exhibition_dates || 'Not specified'}</p>
                              <p><strong>Venue:</strong> {selectedApplication.proposed_venue || 'Not specified'}</p>
                              <p><strong>Budget:</strong> ${selectedApplication.proposed_budget?.toLocaleString() || 'Not specified'}</p>
                              <p><strong>Prize:</strong> ${selectedApplication.proposed_prize_amount?.toLocaleString() || '0'}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm text-gray-700">{selectedApplication.proposed_description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Experience Description</h4>
                          <p className="text-sm text-gray-700">{selectedApplication.experience_description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Curatorial Statement</h4>
                          <p className="text-sm text-gray-700">{selectedApplication.curatorial_statement}</p>
                        </div>

                        {selectedApplication.previous_exhibitions && (
                          <div>
                            <h4 className="font-semibold mb-2">Previous Exhibitions</h4>
                            <p className="text-sm text-gray-700">{selectedApplication.previous_exhibitions}</p>
                          </div>
                        )}

                        {selectedApplication.technical_requirements && (
                          <div>
                            <h4 className="font-semibold mb-2">Technical Requirements</h4>
                            <p className="text-sm text-gray-700">{selectedApplication.technical_requirements}</p>
                          </div>
                        )}

                        {selectedApplication.marketing_plan && (
                          <div>
                            <h4 className="font-semibold mb-2">Marketing Plan</h4>
                            <p className="text-sm text-gray-700">{selectedApplication.marketing_plan}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {application.application_status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(application.id, 'under_review')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(application.id, 'approved', 'Application approved for hosting')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(application.id, 'rejected', 'Application does not meet platform requirements')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}

                {application.application_status === 'under_review' && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approve Application</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Add approval notes (optional)"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                          />
                          <Button
                            onClick={() => handleStatusUpdate(application.id, 'approved', adminNotes)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Confirm Approval
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Request Revision
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Revision</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Explain what needs to be revised..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            required
                          />
                          <Button
                            onClick={() => handleStatusUpdate(application.id, 'requires_revision', adminNotes)}
                            className="w-full"
                          >
                            Request Revision
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(application.id, 'rejected', 'Application rejected after review')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No host applications found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminHostApplications;
