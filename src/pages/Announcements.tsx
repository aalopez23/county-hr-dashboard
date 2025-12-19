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
import { Megaphone, Plus, Edit, Trash2 } from 'lucide-react';
import { getAnnouncements, saveAnnouncement, deleteAnnouncement, type Announcement } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const Announcements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(getAnnouncements());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as Announcement['priority'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAnnouncement: Announcement = {
      id: editingAnnouncement?.id || Date.now().toString(),
      ...formData,
      author: user!.name,
      date: editingAnnouncement?.date || new Date().toISOString().split('T')[0],
    };

    saveAnnouncement(newAnnouncement);
    setAnnouncements(getAnnouncements());
    setDialogOpen(false);
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', priority: 'medium' });

    toast({
      title: editingAnnouncement ? 'Announcement Updated' : 'Announcement Posted',
      description: 'The announcement has been saved successfully.',
    });
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAnnouncement(id);
    setAnnouncements(getAnnouncements());
    toast({ title: 'Announcement Deleted', description: 'The announcement has been removed.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Important updates and information</p>
        </div>

        {user?.role === 'admin' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingAnnouncement ? 'Edit' : 'New'} Announcement</DialogTitle>
                <DialogDescription>
                  {editingAnnouncement ? 'Update the' : 'Create a new'} announcement for all employees
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v: any) => setFormData({ ...formData, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Announcement details..."
                    rows={5}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingAnnouncement ? 'Update' : 'Post'} Announcement
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setEditingAnnouncement(null);
                      setFormData({ title: '', content: '', priority: 'medium' });
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

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Megaphone className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No announcements yet</h3>
              <p className="text-sm text-muted-foreground">
                Check back later for important updates and information.
              </p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className={
                announcement.priority === 'high'
                  ? 'border-l-4 border-l-destructive'
                  : announcement.priority === 'medium'
                  ? 'border-l-4 border-l-accent'
                  : ''
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <CardDescription>
                      Posted by {announcement.author} on {announcement.date}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      announcement.priority === 'high'
                        ? 'destructive'
                        : announcement.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {announcement.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{announcement.content}</p>

                {user?.role === 'admin' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
