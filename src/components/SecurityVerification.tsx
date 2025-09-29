import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, ArrowLeft } from 'lucide-react';

export default function SecurityVerification() {
  const navigate = useNavigate();
  const { verifySecurityAnswer, requiresSecurityVerification, signOut } = useAuth();
  const { toast } = useToast();
  
  const [securityQuestion, setSecurityQuestion] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!requiresSecurityVerification) {
      navigate('/dashboard');
      return;
    }

    // Get user's security question - we need to modify this approach
    // Since we don't have the user ID yet, we need to pass it differently
    loadSecurityQuestion();
  }, [requiresSecurityVerification, navigate]);

  const loadSecurityQuestion = async () => {
    try {
      // We need to get the question for the pending user
      // For now, we'll get a random question - in production, you'd want to 
      // store which specific question the user needs to answer
      const { data: questions } = await supabase
        .from('security_questions')
        .select('*')
        .limit(3);

      if (questions && questions.length > 0) {
        // Get a random question for demo purposes
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setSecurityQuestion(randomQuestion.question);
      } else {
        setSecurityQuestion('What is your favorite color?'); // Fallback
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading security question:', error);
      setSecurityQuestion('What is your favorite color?'); // Fallback
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);

    try {
      const { error } = await verifySecurityAnswer(securityAnswer);
      
      if (error) {
        toast({
          title: 'Verification Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Security verification completed successfully',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during verification',
        variant: 'destructive',
      });
    }

    setVerifying(false);
  };

  const handleCancel = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-lg">Loading security verification...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Security Verification
          </CardTitle>
          <p className="text-muted-foreground">
            Please answer your security question to complete the login process
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleVerification} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Security Question</Label>
              <div className="p-3 bg-muted/30 rounded-md border">
                <p className="text-sm text-foreground">{securityQuestion}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security-answer" className="text-sm font-medium">
                Your Answer
              </Label>
              <Input
                id="security-answer"
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter your security answer"
                required
                className="h-11"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                disabled={verifying || !securityAnswer.trim()}
                className="h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-medium"
              >
                {verifying ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-11 border-border/50 hover:bg-muted/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel & Sign Out
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}