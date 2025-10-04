import { ReactNode } from 'react';
import { useAccountStatus } from '@/hooks/useAccountStatus';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Phone, Mail } from 'lucide-react';

interface FrozenAccountGuardProps {
  children: ReactNode;
  feature: string;
  className?: string;
}

export function FrozenAccountGuard({ children, feature, className }: FrozenAccountGuardProps) {
  const { 
    isFrozen, 
    freezeReason, 
    customFreezeTitle, 
    customFreezeMessage, 
    customFreezeContactInfo, 
    showContact, 
    showReason 
  } = useAccountStatus();

  if (!isFrozen) {
    return <>{children}</>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={className}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {customFreezeTitle || "Account Frozen"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive/80 mb-2">
              {customFreezeMessage || `Your account has been temporarily frozen. You cannot access ${feature} at this time.`}
            </p>
            {showReason && freezeReason && (
              <p className="text-sm text-destructive/80">
                <strong>Reason:</strong> {freezeReason}
              </p>
            )}
          </div>
          
          {showContact && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {customFreezeContactInfo || "To resolve this issue, please contact our support team:"}
              </p>
              
              {!customFreezeContactInfo && (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => window.open('tel:+1-800-GOLD-MINT', '_self')}
                  >
                    <Phone className="h-4 w-4" />
                    Call Support: 1-800-GOLD-MINT
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => window.open('mailto:support@goldmint.com?subject=Account%20Frozen%20Support', '_self')}
                  >
                    <Mail className="h-4 w-4" />
                    Email Support: support@goldmint.com
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {showContact && !customFreezeContactInfo && (
            <div className="text-xs text-muted-foreground text-center">
              Our support team is available 24/7 to assist you.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Higher-order component for easier usage
export function withFrozenAccountGuard<T extends object>(
  Component: React.ComponentType<T>,
  feature: string
) {
  return function FrozenAccountGuardedComponent(props: T) {
    return (
      <FrozenAccountGuard feature={feature}>
        <Component {...props} />
      </FrozenAccountGuard>
    );
  };
}
