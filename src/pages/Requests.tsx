import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Check, X, Edit, Trash2 } from 'lucide-react';
import { getRequests, saveRequest, deleteRequest, type TimeOffRequest } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const Requests = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<TimeOffRequest[]>(getRequests());
  const [filter, setFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<TimeOffRequest | null>(null);

  const [formData, setFormData] = useState({
    type: 'vacation' as TimeOffRequest['type'],
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: TimeOffRequest = {
      id: editingRequest?.id || Date.now().toString(),
      employeeId: user!.id,
      employeeName: user!.name,
      ...formData,
      days,
      status: editingRequest?.status || 'pending',
      submittedDate: editingRequest?.submittedDate || new Date().toISOString().split('T')[0],
      reviewedBy: editingRequest?.reviewedBy,
      reviewedDate: editingRequest?.reviewedDate,
    };

    saveRequest(newRequest);
    setRequests(getRequests());
    setDialogOpen(false);
    setEditingRequest(null);
    setFormData({ type: 'vacation', startDate: '', endDate: '', reason: '' });
    
    toast({
      title: editingRequest ? 'Request Updated' : 'Request Submitted',
      description: editingRequest ? 'Your time off request has been updated.' : 'Your time off request has been submitted for approval.',
    });
  };

  const handleApprove = (request: TimeOffRequest) => {
    const updatedRequest = {
      ...request,
      status: 'approved' as const,
      reviewedBy: user!.name,
      reviewedDate: new Date().toISOString().split('T')[0],
    };
    saveRequest(updatedRequest);
    setRequests(getRequests());
    
    toast({
      title: 'Request Approved',
      description: `Time off request for ${request.employeeName} has been approved.`,
    });
  };

  const handleDeny = (request: TimeOffRequest) => {
    const updatedRequest = {
      ...request,
      status: 'denied' as const,
      reviewedBy: user!.name,
      reviewedDate: new Date().toISOString().split('T')[0],
    };
    saveRequest(updatedRequest);
    setRequests(getRequests());
    
    toast({
      title: 'Request Denied',
      description: `Time off request for ${request.employeeName} has been denied.`,
      variant: 'destructive',
    });
  };

  const handleDelete = (id: string) => {
    deleteRequest(id);
    setRequests(getRequests());
    toast({ title: 'Request Deleted', description: 'The time off request has been deleted.' });
  };

  const handleEdit = (request: TimeOffRequest) => {
    setEditingRequest(request);
    setFormData({
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
    });
    setDialogOpen(true);
  };

  const filteredRequests = requests.filter(r => {
    if (user?.role === 'employee' && r.employeeId !== user.id) return false;
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Time Off Requests</h1>
          <p className="text-muted-foreground">Submit and manage your time off requests</p>
        </div>
        
        {user?.role === 'employee' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingRequest ? 'Edit' : 'New'} Time Off Request</DialogTitle>
                <DialogDescription>
                  {editingRequest ? 'Update your' : 'Submit a new'} time off request for approval
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Request Type</Label>
                  <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Brief reason for time off..."
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingRequest ? 'Update' : 'Submit'} Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setEditingRequest(null);
                      setFormData({ type: 'vacation', startDate: '', endDate: '', reason: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'denied'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No requests found</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'all' ? 'No time off requests yet.' : `No ${filter} requests.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {user?.role === 'admin' ? request.employeeName : 'Time Off Request'}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {request.type} • {request.days} day{request.days !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      request.status === 'approved'
                        ? 'default'
                        : request.status === 'denied'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dates:</span>
                    <span className="font-medium">
                      {request.startDate} to {request.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span className="font-medium">{request.submittedDate}</span>
                  </div>
                  {request.reviewedBy && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reviewed by:</span>
                      <span className="font-medium">
                        {request.reviewedBy} on {request.reviewedDate}
                      </span>
                    </div>
                  )}
                  <div className="pt-2">
                    <p className="text-muted-foreground">Reason:</p>
                    <p className="mt-1">{request.reason}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {user?.role === 'admin' && request.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        className="gap-1"
                        onClick={() => handleApprove(request)}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => handleDeny(request)}
                      >
                        <X className="h-4 w-4" />
                        Deny
                      </Button>
                    </>
                  )}
                  {user?.role === 'employee' && request.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => handleEdit(request)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => handleDelete(request.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;
