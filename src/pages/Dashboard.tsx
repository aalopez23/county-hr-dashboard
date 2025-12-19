import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Megaphone, TrendingUp, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRequests, getAnnouncements } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user } = useAuth();
  const requests = getRequests();
  const announcements = getAnnouncements();

  const userRequests = requests.filter(r => r.employeeId === user?.id);
  const pendingRequests = user?.role === 'admin' 
    ? requests.filter(r => r.status === 'pending')
    : userRequests.filter(r => r.status === 'pending');

  const upcomingHolidays = [
    { date: 'Nov 27-28', name: 'Thanksgiving' },
    { date: 'Dec 25-26', name: 'Christmas' },
    { date: 'Jan 1', name: 'New Year' },
  ];

  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {user?.title} • {user?.department}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user?.role === 'employee' && (
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardDescription>PTO Balance</CardDescription>
              <CardTitle className="text-3xl font-bold">{user.ptoBalance} hrs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">≈ {Math.floor(user.ptoBalance / 8)} days remaining</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardDescription>Pending Requests</CardDescription>
            <CardTitle className="text-3xl font-bold">{pendingRequests.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/requests">
              <Button variant="link" className="h-auto p-0 text-xs">
                View all requests →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {user?.role === 'admin' && (
          <>
            <Card className="border-l-4 border-l-success">
              <CardHeader className="pb-3">
                <CardDescription>Total Employees</CardDescription>
                <CardTitle className="text-3xl font-bold">127</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/directory">
                  <Button variant="link" className="h-auto p-0 text-xs">
                    View directory →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader className="pb-3">
                <CardDescription>Active Announcements</CardDescription>
                <CardTitle className="text-3xl font-bold">{announcements.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/announcements">
                  <Button variant="link" className="h-auto p-0 text-xs">
                    Manage →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Holidays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Holidays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingHolidays.map((holiday, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{holiday.name}</p>
                    <p className="text-sm text-muted-foreground">{holiday.date}</p>
                  </div>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-accent" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="font-medium">{announcement.title}</p>
                    <Badge variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/announcements">
              <Button variant="outline" className="mt-4 w-full">
                View All Announcements
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/requests">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6">
                <Calendar className="h-6 w-6 text-primary" />
                Request Time Off
              </Button>
            </Link>
            <Link to="/directory">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6">
                <Users className="h-6 w-6 text-primary" />
                Employee Directory
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6">
                <FileText className="h-6 w-6 text-primary" />
                My Profile
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/reports">
                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  View Reports
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
