import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database as DatabaseIcon, 
  Users, 
  Save, 
  Video, 
  Grid,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoGrid, setVideoGrid] = useState("2x2");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState("90");
  const [backupFrequency, setBackupFrequency] = useState("daily");

  const handleSaveSettings = (settingType: string) => {
    setIsSubmitting(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Settings Saved",
        description: `${settingType} settings have been updated successfully.`,
      });
    }, 1500);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <Tabs defaultValue="general">
          <div className="flex justify-between items-start mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="general">
                <SettingsIcon className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="data">
                <DatabaseIcon className="h-4 w-4 mr-2" />
                Data Management
              </TabsTrigger>
              <TabsTrigger value="surveillance">
                <Video className="h-4 w-4 mr-2" />
                Surveillance
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your general system preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="system-name">System Name</Label>
                      <Input id="system-name" defaultValue="Water Reservoir Management System" />
                      <p className="text-sm text-gray-500">This name will appear in reports and notifications</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time-zone">Time Zone</Label>
                      <Select defaultValue="UTC+5">
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                          <SelectItem value="UTC+1">UTC+1 (Paris, Berlin)</SelectItem>
                          <SelectItem value="UTC+2">UTC+2 (Athens, Cairo)</SelectItem>
                          <SelectItem value="UTC+3">UTC+3 (Moscow, Istanbul)</SelectItem>
                          <SelectItem value="UTC+4">UTC+4 (Dubai, Baku)</SelectItem>
                          <SelectItem value="UTC+5">UTC+5 (Tashkent, Islamabad)</SelectItem>
                          <SelectItem value="UTC+5.5">UTC+5.5 (New Delhi)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">All timestamps will be displayed in this time zone</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Default Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ru">Russian</SelectItem>
                          <SelectItem value="uz">Uzbek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="yyyy-mm-dd">
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                          <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Administrator Email</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@reservoir.gov" />
                    <p className="text-sm text-gray-500">Critical system notifications will be sent to this email</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Enable to temporarily disable user access during maintenance</p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSaveSettings("General")} disabled={isSubmitting}>
                  <Save className={`h-4 w-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                    </div>
                    <Switch 
                      checked={smsNotifications} 
                      onCheckedChange={setSmsNotifications} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive real-time push notifications</p>
                    </div>
                    <Switch 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications} 
                    />
                  </div>
                </div>

                <h3 className="text-lg font-medium pt-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Water Level Alerts</Label>
                      <p className="text-sm text-gray-500">Notify when reservoir levels reach critical thresholds</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Water Requests</Label>
                      <p className="text-sm text-gray-500">Notify when new water requests are submitted</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Maintenance</Label>
                      <p className="text-sm text-gray-500">Notify about scheduled system maintenance</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Activity</Label>
                      <p className="text-sm text-gray-500">Notify about important user actions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSaveSettings("Notification")} disabled={isSubmitting}>
                  <Save className={`h-4 w-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage system security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for administrator accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password Expiry</Label>
                      <p className="text-sm text-gray-500">Force password change every 90 days</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lockout Policy</Label>
                      <p className="text-sm text-gray-500">Lock accounts after 5 failed login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-password-length">Minimum Password Length</Label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                        <SelectItem value="16">16 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">IP Access Controls</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                    <Input id="ip-whitelist" placeholder="192.168.1.0/24, 10.0.0.1" />
                    <p className="text-sm text-gray-500">Enter comma-separated IP addresses or ranges</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label>Activity Logging</Label>
                    <p className="text-sm text-gray-500">Log all user actions for audit purposes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSaveSettings("Security")} disabled={isSubmitting}>
                  <Save className={`h-4 w-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management Settings</CardTitle>
                <CardDescription>
                  Configure how data is stored, backed up, and retained
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <h3 className="text-lg font-medium">Data Retention</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Sensor Data Retention Period</Label>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">High-frequency sensor data will be aggregated after this period</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Cleanup</Label>
                      <p className="text-sm text-gray-500">Automatically remove data older than the retention period</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <h3 className="text-lg font-medium pt-4">Backup Configuration</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Remote Backup</Label>
                      <p className="text-sm text-gray-500">Store backups in a remote location</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">Backup Retention</Label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue placeholder="Select backup retention" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Keep 5 most recent</SelectItem>
                        <SelectItem value="10">Keep 10 most recent</SelectItem>
                        <SelectItem value="30">Keep 30 most recent</SelectItem>
                        <SelectItem value="all">Keep all</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <h3 className="text-lg font-medium pt-4">Data Export</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Scheduled Exports</Label>
                      <p className="text-sm text-gray-500">Automatically export data on schedule</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Default Export Format</Label>
                    <Select defaultValue="csv">
                      <SelectTrigger>
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSaveSettings("Data Management")} disabled={isSubmitting}>
                  <Save className={`h-4 w-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="surveillance">
            <Card>
              <CardHeader>
                <CardTitle>Video Surveillance Settings</CardTitle>
                <CardDescription>
                  Configure video monitoring system preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <h3 className="text-lg font-medium">Display Configuration</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-grid">Video Grid Layout</Label>
                    <Select value={videoGrid} onValueChange={setVideoGrid}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grid layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x1">1×1 (Single camera)</SelectItem>
                        <SelectItem value="2x2">2×2 (4 cameras)</SelectItem>
                        <SelectItem value="3x3">3×3 (9 cameras)</SelectItem>
                        <SelectItem value="4x4">4×4 (16 cameras)</SelectItem>
                        <SelectItem value="6x6">6×6 (36 cameras)</SelectItem>
                        <SelectItem value="8x8">8×8 (64 cameras)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">Select how many cameras to display at once</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="video-quality">Default Video Quality</Label>
                      <Select defaultValue="720p">
                        <SelectTrigger>
                          <SelectValue placeholder="Select video quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="480p">480p (SD)</SelectItem>
                          <SelectItem value="720p">720p (HD)</SelectItem>
                          <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                          <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frame-rate">Default Frame Rate</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frame rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 FPS</SelectItem>
                          <SelectItem value="15">15 FPS</SelectItem>
                          <SelectItem value="24">24 FPS</SelectItem>
                          <SelectItem value="30">30 FPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium pt-4">Recording Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Continuous Recording</Label>
                      <p className="text-sm text-gray-500">Record footage continuously</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Motion Detection</Label>
                      <p className="text-sm text-gray-500">Only record when motion is detected</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storage-duration">Footage Storage Duration</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <h3 className="text-lg font-medium pt-4">Alert Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Motion Alerts</Label>
                      <p className="text-sm text-gray-500">Receive alerts when motion is detected</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Camera Offline Alerts</Label>
                      <p className="text-sm text-gray-500">Receive alerts when a camera goes offline</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alert-sensitivity">Motion Detection Sensitivity</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select sensitivity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium pt-4">Mobile Access</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Mobile Viewing</Label>
                      <p className="text-sm text-gray-500">Allow surveillance camera access from mobile devices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Optimize for Mobile Data</Label>
                      <p className="text-sm text-gray-500">Reduce video quality on mobile networks</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSaveSettings("Surveillance")} disabled={isSubmitting}>
                  <Save className={`h-4 w-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}