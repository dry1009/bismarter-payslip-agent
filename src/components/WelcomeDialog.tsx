
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile } from "lucide-react";

interface WelcomeDialogProps {
  open: boolean;
  onClose: (name: string) => void;
}

const WelcomeDialog = ({ open, onClose }: WelcomeDialogProps) => {
  const [name, setName] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onClose(name.trim());
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <Smile className="h-6 w-6 text-primary" />
            ברוכים הבאים למערכת השכר החכמה
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            זהו דמו של סוכן תלושי השכר החכם שלנו. נשמח לדעת איך לפנות אליך.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="השם שלך"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-right"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!name.trim()}
              className="w-full"
            >
              המשך לצ'אט
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
