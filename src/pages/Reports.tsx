import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, PieChart, TrendingUp } from 'lucide-react';
import { getRequests } from '@/lib/storage';

const Reports = () => {
  const requests = getRequests();

  const statusCounts = {
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    denied: requests.filter((r) => r.status === 'denied').length,
  };

  const typeCounts = {
    vacation: requests.filter((r) => r.type === 'vacation').length,
    sick: requests.filter((r) => r.type === 'sick').length,
    personal: requests.filter((r) => r.type === 'personal').length,
  };

  const totalDays = requests.reduce((sum, r) => sum + r.days, 0);
  const approvedDays = requests
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.days, 0);

  const exportToCSV = () => {
    const headers = ['Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Status', 'Submitted'];
    const rows = requests.map((r) => [
      r.employeeName,
      r.type,
      r.startDate,
      r.endDate,
      r.days,
      r.status,
      r.submittedDate,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-off-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Reports</h1>
          <p className="text-muted-foreground">Analytics and insights</p>
        </div>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl font-bold">{requests.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {totalDays} total days requested
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardDescription>Approved Days</CardDescription>
            <CardTitle className="text-3xl font-bold">{approvedDays}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {statusCounts.approved} approved requests
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl font-bold">{statusCounts.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Requests by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => {
                const total = requests.length;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                const color =
                  status === 'approved'
                    ? 'bg-success'
                    : status === 'denied'
                    ? 'bg-destructive'
                    : 'bg-warning';

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-medium">{status}</span>
                      <span className="text-muted-foreground">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full ${color} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Requests by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(typeCounts).map(([type, count]) => {
                const total = requests.length;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-medium">{type}</span>
                      <span className="text-muted-foreground">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PTO Usage Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Last 10 time off requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {requests
              .slice()
              .reverse()
              .slice(0, 10)
              .map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium">{request.employeeName}</p>
                    <p className="text-muted-foreground capitalize">
                      {request.type} • {request.days} day{request.days !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{request.startDate}</p>
                    <p
                      className={`text-xs capitalize ${
                        request.status === 'approved'
                          ? 'text-success'
                          : request.status === 'denied'
                          ? 'text-destructive'
                          : 'text-warning'
                      }`}
                    >
                      {request.status}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
