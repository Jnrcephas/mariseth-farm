
"use client"

import { useUserActions } from "@/hooks/auth/useAuth";
import useIdelTimeOut from "@/hooks/auth/useIdleTimeOut";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";


const IdleTimeOutNotification = () => {
  const {logout} = useUserActions()
  const { isOpen, setIsOpen } = useIdelTimeOut(logout);


  return (
    <Dialog open={isOpen} >
      <DialogContent>
          <DialogHeader>
              {/* <DialogTitle>Idle Timeout</DialogTitle> */}
              <DialogDescription>
                <div className="mt-5.5 pb-2 text-xl font-bold text-dark dark:text-white sm:text-lg text-center">
                  You&apos;ve been inactive for a while!
                </div>
                <div className="mb-8 font-medium mt-3">
                  You&apos;ll be logged out in 3 minutes. Click <span className="font-bold">Cancel</span> to keep you logged in.
                </div>
              </DialogDescription>
          </DialogHeader>
          <DialogFooter>
              <Button variant="destructive" onClick={logout} className="cursor-pointer">
                  Logout
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)} className="cursor-pointer">
                  Cancel
              </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IdleTimeOutNotification;
