
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter, DollarSign, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'submission_fee' | 'template_purchase';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  payment_id?: string;
  metadata?: any;
  profiles?: {
    first_name: string;
    last_name: string;
    username: string;
  };
}

const TransactionTrackingPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'failed' | 'refunded'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'submission_fee' | 'template_purchase'>('all');

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin-transactions', statusFilter, typeFilter],
    queryFn: async () => {
      console.log('Fetching transactions for admin...');
      
      // Mock data for now - replace with actual transaction table query
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          user_id: 'user1',
          amount: 25.00,
          type: 'submission_fee',
          status: 'paid',
          created_at: new Date().toISOString(),
          payment_id: 'pi_1234567890',
          profiles: {
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe'
          }
        },
        {
          id: '2',
          user_id: 'user2',
          amount: 49.99,
          type: 'template_purchase',
          status: 'paid',
          created_at: new Date().toISOString(),
          payment_id: 'pi_0987654321',
          profiles: {
            first_name: 'Jane',
            last_name: 'Smith',
            username: 'janesmith'
          }
        }
      ];

      return mockTransactions;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = 
      transaction.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.payment_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'submission_fee': return <FileText className="h-4 w-4" />;
      case 'template_purchase': return <DollarSign className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const exportTransactions = (format: 'csv' | 'xlsx') => {
    // Implementation for exporting transactions
    console.log(`Exporting transactions as ${format}`);
  };

  const downloadInvoice = (transactionId: string) => {
    // Implementation for downloading invoice PDF
    console.log(`Downloading invoice for transaction ${transactionId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + (t.status === 'paid' ? t.amount : 0), 0);
  const pendingRevenue = filteredTransactions.reduce((sum, t) => sum + (t.status === 'pending' ? t.amount : 0), 0);

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Revenue</p>
                <p className="text-2xl font-bold">${pendingRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{filteredTransactions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user name, username, or payment ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="submission_fee">Submission Fee</SelectItem>
                <SelectItem value="template_purchase">Template Purchase</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportTransactions('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportTransactions('xlsx')}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">@{transaction.profiles?.username}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{transaction.payment_id || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(transaction.created_at).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadInvoice(transaction.id)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTrackingPanel;
