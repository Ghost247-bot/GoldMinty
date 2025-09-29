import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, Gem, TrendingUp, ArrowLeft, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Enhanced registration fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  // Security questions
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [selectedQuestion1, setSelectedQuestion1] = useState('');
  const [selectedQuestion2, setSelectedQuestion2] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  
  // Login security verification
  const [showSecurityVerification, setShowSecurityVerification] = useState(false);
  const [loginSecurityQuestion, setLoginSecurityQuestion] = useState('');
  const [loginSecurityAnswer, setLoginSecurityAnswer] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load security questions on component mount
  useEffect(() => {
    loadSecurityQuestions();
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const loadSecurityQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('security_questions')
        .select('*')
        .order('question');
      
      if (error) throw error;
      setSecurityQuestions(data || []);
    } catch (error) {
      console.error('Error loading security questions:', error);
    }
  };

  const hashAnswer = (answer: string) => {
    // Simple hash function - in production, use a proper crypto library
    return btoa(answer.toLowerCase().trim());
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting sign in for:', email);
      const { error, requiresVerification } = await signIn(email, password);
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else if (requiresVerification) {
        console.log('Security verification required');
        toast({
          title: 'Security Verification Required',
          description: 'Please complete security verification to access your dashboard',
        });
        navigate('/security-verification');
      } else {
        console.log('Sign in successful');
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  const handleSecurityVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userAnswer } = await supabase
        .from('user_security_answers')
        .select('answer_hash')
        .eq('user_id', tempUserId)
        .eq('question_id', 
          securityQuestions.find(q => q.question === loginSecurityQuestion)?.id
        )
        .single();

      if (userAnswer && userAnswer.answer_hash === hashAnswer(loginSecurityAnswer)) {
        toast({
          title: 'Success',
          description: 'Security verification passed. Logged in successfully.',
        });
        setShowSecurityVerification(false);
        navigate('/');
      } else {
        toast({
          title: 'Security Verification Failed',
          description: 'Incorrect security answer. Please try again.',
          variant: 'destructive',
        });
        // Sign out the user
        await supabase.auth.signOut();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Security verification failed',
        variant: 'destructive',
      });
      await supabase.auth.signOut();
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedQuestion1 || !selectedQuestion2) {
      toast({
        title: 'Error',
        description: 'Please select two security questions.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedQuestion1 === selectedQuestion2) {
      toast({
        title: 'Error',
        description: 'Please select two different security questions.',
        variant: 'destructive',
      });
      return;
    }

    if (!answer1.trim() || !answer2.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide answers to both security questions.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const { error, data } = await signUp(email, password, fullName, {
        firstName,
        lastName,
        phone,
        dateOfBirth,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country
      });
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data?.user) {
        // Wait a moment for the user session to be fully established
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Store security questions and answers with better error handling
        try {
          const securityAnswers = [
            {
              user_id: data.user.id,
              question_id: selectedQuestion1,
              answer_hash: hashAnswer(answer1)
            },
            {
              user_id: data.user.id,
              question_id: selectedQuestion2,
              answer_hash: hashAnswer(answer2)
            }
          ];

          // Insert security answers one by one to avoid batch issues
          for (const answer of securityAnswers) {
            const { error: answerError } = await supabase
              .from('user_security_answers')
              .insert(answer);

            if (answerError) {
              console.error('Error saving security answer:', answerError);
              toast({
                title: 'Warning',
                description: 'Account created but security questions could not be saved. Please contact support.',
                variant: 'destructive',
              });
              break;
            }
          }
        } catch (answerError) {
          console.error('Security answer error:', answerError);
          toast({
            title: 'Warning',
            description: 'Account created but security questions could not be saved. Please contact support.',
            variant: 'destructive',
          });
        }
        
        toast({
          title: 'Success',
          description: 'Account created successfully! Please check your email for verification.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during registration.',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: 'var(--gradient-hero)' }}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[100px] animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Back to Home Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-6 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-luxury border-0 bg-card/95 backdrop-blur-md animate-scale-in">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-dark to-gold rounded-2xl flex items-center justify-center shadow-glow">
                <Gem className="w-8 h-8 text-navy-deep" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display text-gradient-gold mb-2">GoldMint</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Your trusted precious metals platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/50">
                <TabsTrigger value="signin" className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground">
                  Create Account
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="animate-fade-in">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20 pr-12"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-dark text-navy-deep font-semibold shadow-glow transition-all duration-300 hover-scale" 
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="animate-fade-in">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname" className="text-sm font-medium text-foreground">
                        First Name
                      </Label>
                      <Input
                        id="signup-firstname"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                        placeholder="First name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname" className="text-sm font-medium text-foreground">
                        Last Name
                      </Label>
                      <Input
                        id="signup-lastname"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-dob" className="text-sm font-medium text-foreground">
                      Date of Birth
                    </Label>
                    <Input
                      id="signup-dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20 pr-12"
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Shield className="w-4 h-4" />
                      Address Information (Optional)
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        placeholder="Address Line 1"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        placeholder="Address Line 2 (Optional)"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      />
                      <Input
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="ZIP Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      />
                      <Input
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                  </div>

                  {/* Security Questions Section */}
                  <div className="space-y-4 pt-4 border-t border-border/20">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <HelpCircle className="w-4 h-4" />
                      Security Questions (Required)
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">
                          Security Question 1
                        </Label>
                        <Select value={selectedQuestion1} onValueChange={setSelectedQuestion1}>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:border-gold">
                            <SelectValue placeholder="Select your first security question" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border border-border shadow-lg z-50 max-h-64">
                            {securityQuestions.map((question) => (
                              <SelectItem 
                                key={question.id} 
                                value={question.id}
                                className="hover:bg-muted focus:bg-muted cursor-pointer"
                              >
                                {question.question}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="text"
                          value={answer1}
                          onChange={(e) => setAnswer1(e.target.value)}
                          className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                          placeholder="Your answer"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">
                          Security Question 2
                        </Label>
                        <Select value={selectedQuestion2} onValueChange={setSelectedQuestion2}>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:border-gold">
                            <SelectValue placeholder="Select your second security question" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border border-border shadow-lg z-50 max-h-64">
                            {securityQuestions
                              .filter(q => q.id !== selectedQuestion1)
                              .map((question) => (
                                <SelectItem 
                                  key={question.id} 
                                  value={question.id}
                                  className="hover:bg-muted focus:bg-muted cursor-pointer"
                                >
                                  {question.question}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="text"
                          value={answer2}
                          onChange={(e) => setAnswer2(e.target.value)}
                          className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                          placeholder="Your answer"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-dark text-navy-deep font-semibold shadow-glow transition-all duration-300 hover-scale" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Security Question Verification Modal */}
            {showSecurityVerification && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md mx-4 shadow-luxury border-0 bg-card animate-scale-in">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-dark to-gold rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-navy-deep" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">Security Verification</CardTitle>
                    <CardDescription>
                      Please answer your security question to complete login
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSecurityVerification} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">
                          {loginSecurityQuestion}
                        </Label>
                        <Input
                          type="text"
                          value={loginSecurityAnswer}
                          onChange={(e) => setLoginSecurityAnswer(e.target.value)}
                          className="h-12 bg-background/50 border-border/50 focus:border-gold focus:ring-gold/20"
                          placeholder="Your answer"
                          required
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowSecurityVerification(false);
                            supabase.auth.signOut();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-dark text-navy-deep font-semibold"
                          disabled={loading}
                        >
                          {loading ? 'Verifying...' : 'Verify'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-border/20">
              <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-success" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-gold" />
                  <span>Trusted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Gem className="w-4 h-4 text-gold" />
                  <span>Premium</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer text */}
        <p className="text-center text-sm text-muted-foreground/80 mt-6">
          By continuing, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
}