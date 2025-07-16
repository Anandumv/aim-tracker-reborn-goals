import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings, Bell, Shield, Clock } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { settings, permission, requestPermission, updateSettings } = useNotifications();

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }
    updateSettings({ enabled });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[480px] border-0 bg-card/95 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Smart Notifications</h3>
            </div>
            
            <div className="space-y-4 pl-8">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Gentle nudges to check your progress
                  </p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>

              {settings.enabled && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Frequency</Label>
                    <Select 
                      value={settings.frequency} 
                      onValueChange={(value: any) => updateSettings({ frequency: value })}
                    >
                      <SelectTrigger className="border-0 bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preferred Time</Label>
                    <Input
                      type="time"
                      value={settings.time}
                      onChange={(e) => updateSettings({ time: e.target.value })}
                      className="border-0 bg-muted/50"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Privacy Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Privacy & Data</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                All data stored locally on your device
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                No cloud storage or data sharing
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Complete privacy and offline functionality
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">About</h3>
            </div>
            
            <div className="pl-8 text-sm text-muted-foreground">
              <p>
                Grail is designed to be distraction-free and privacy-first. 
                Focus on your goals without streaks, competitions, or social pressure.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={() => setOpen(false)} className="px-8">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}