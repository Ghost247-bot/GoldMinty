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
import { Eye, EyeOff, Shield, Gem, TrendingUp, ArrowLeft, HelpCircle, Star, Award, CheckCircle, Lock, Users, Globe, Zap } from 'lucide-react';
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

      if (userAnswer && userAnswer.answer_hash === loginSecurityAnswer.toLowerCase().trim()) {
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
        console.log('User created, storing security questions for user:', data.user.id);
        
        // Store security questions and answers using edge function
        try {
          const securityAnswers = [
            {
              user_id: data.user.id,
              question_id: selectedQuestion1,
              answer_hash: answer1.toLowerCase().trim() // Store as plain text
            },
            {
              user_id: data.user.id,
              question_id: selectedQuestion2,
              answer_hash: answer2.toLowerCase().trim() // Store as plain text
            }
          ];

          console.log('Saving security answers for user:', data.user.id);

          // Call edge function to save security answers
          const { error: functionError } = await supabase.functions.invoke('save-security-answers', {
            body: {
              user_id: data.user.id,
              security_answers: securityAnswers
            }
          });

          if (functionError) {
            console.error('Error calling save-security-answers function:', functionError);
            toast({
              title: 'Warning',
              description: 'Account created but security questions could not be saved. Please contact support.',
              variant: 'destructive',
            });
          } else {
            console.log('Security answers saved successfully via edge function');
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-navy-deep to-slate-800">
      
      {/* Professional grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }}
        ></div>
      </div>
      
      {/* Sophisticated animated background */}
      <div className="absolute inset-0">
        {/* Primary ambient lighting */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-gold/8 via-gold/4 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-gold-light/6 via-gold/3 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Secondary accent lighting */}
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-gold/5 to-transparent rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-gold-light/4 to-transparent rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Floating elements for depth */}
        <div className="absolute top-20 right-1/4 w-2 h-2 bg-gold/60 rounded-full animate-float delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-gold-light/40 rounded-full animate-float delay-1000"></div>
        <div className="absolute top-1/3 right-20 w-1 h-1 bg-gold/80 rounded-full animate-float delay-500"></div>
        <div className="absolute top-1/4 left-20 w-2.5 h-2.5 bg-gold-light/30 rounded-full animate-float delay-800"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-gold/50 rounded-full animate-float delay-1200"></div>
      </div>

      {/* Professional side branding panels */}
      <div className="absolute inset-y-0 left-0 w-1/4 hidden xl:block">
        <div className="h-full flex flex-col justify-center items-start space-y-12 px-12">
          {/* Company credentials */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-dark to-gold-light rounded-xl flex items-center justify-center shadow-xl">
                <Award className="w-6 h-6 text-navy-deep" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">SEC Registered</h3>
                <p className="text-white/60 text-sm">Fully compliant investment platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-dark to-gold-light rounded-xl flex items-center justify-center shadow-xl">
                <Shield className="w-6 h-6 text-navy-deep" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bank-Grade Security</h3>
                <p className="text-white/60 text-sm">256-bit encryption & multi-factor auth</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-dark to-gold-light rounded-xl flex items-center justify-center shadow-xl">
                <CheckCircle className="w-6 h-6 text-navy-deep" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Insured Holdings</h3>
                <p className="text-white/60 text-sm">$500M coverage through Lloyd's of London</p>
              </div>
            </div>
          </div>
          
          {/* Awards section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider">Recognition</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-white/70 text-sm">Best Precious Metals Platform 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-white/70 text-sm">FinTech Innovation Award</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-white/70 text-sm">A+ Better Business Bureau</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced statistics panel */}
      <div className="absolute inset-y-0 right-0 w-1/4 hidden xl:block">
        <div className="h-full flex flex-col justify-center items-end space-y-12 px-12">
          {/* Key metrics */}
          <div className="text-right space-y-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                $2.5B+
              </div>
              <p className="text-white/60 text-sm font-medium">Assets Under Management</p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-gold-light ml-auto"></div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                50,000+
              </div>
              <p className="text-white/60 text-sm font-medium">Global Investors</p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-gold-light ml-auto"></div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                99.9%
              </div>
              <p className="text-white/60 text-sm font-medium">Platform Uptime</p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-gold-light ml-auto"></div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider text-right">Global Presence</h4>
            <div className="space-y-3 text-right">
              <div className="flex items-center justify-end space-x-2">
                <span className="text-white/70 text-sm">Available in 50+ countries</span>
                <Globe className="w-4 h-4 text-gold" />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-white/70 text-sm">24/7 customer support</span>
                <Users className="w-4 h-4 text-gold" />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-white/70 text-sm">Instant settlements</span>
                <Zap className="w-4 h-4 text-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-xl">
          {/* Professional back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-10 text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 group backdrop-blur-sm border border-white/10 rounded-full px-6 h-10"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Return to Homepage</span>
          </Button>

          {/* Premium main card */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-2xl relative overflow-hidden">
            {/* Subtle card accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] via-transparent to-gold-light/[0.02]"></div>
            
            <CardHeader className="text-center pb-10 pt-12 relative">
              {/* Premium logo design */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  {/* Main logo container */}
                  <div className="w-24 h-24 bg-gradient-to-br from-gold-dark via-gold to-gold-light rounded-[20px] flex items-center justify-center shadow-2xl relative overflow-hidden border border-gold/20">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Gem className="w-12 h-12 text-navy-deep relative z-10" />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-dark to-gold-light rounded-[20px] blur-xl opacity-30 scale-110 -z-10"></div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-[20px] border-2 border-gold/30 scale-110 animate-pulse"></div>
                </div>
              </div>
              
              {/* Enhanced branding */}
              <div className="space-y-4">
                <CardTitle className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent tracking-tight">
                  GoldMint
                </CardTitle>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full"></div>
                <CardDescription className="text-slate-600 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                  Premium precious metals investment platform trusted by institutions worldwide
                </CardDescription>
              </div>
              
              {/* Trust badges */}
              <div className="flex justify-center items-center space-x-6 mt-8">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-medium">SEC Registered</span>
                </div>
                <div className="w-1 h-4 bg-slate-300"></div>
                <div className="flex items-center space-x-2 text-slate-500">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">FDIC Insured</span>
                </div>
              </div>
            </CardHeader>
          
          <CardContent className="pb-12 px-12">
            <Tabs defaultValue="signin" className="w-full">
              {/* Professional tab navigation */}
              <TabsList className="grid w-full grid-cols-2 mb-12 h-16 bg-slate-50 backdrop-blur-sm rounded-2xl p-1.5 border border-slate-200">
                <TabsTrigger 
                  value="signin" 
                  className="text-sm font-semibold rounded-xl h-12 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-lg transition-all duration-300 data-[state=active]:shadow-slate-200/50"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Member Access</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="text-sm font-semibold rounded-xl h-12 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-lg transition-all duration-300 data-[state=active]:shadow-slate-200/50"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Join Platform</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              {/* Professional Sign In Form */}
              <TabsContent value="signin" className="animate-fade-in">
                <form onSubmit={handleSignIn} className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="signin-email" className="text-sm font-semibold text-slate-700 flex items-center">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-16 bg-white border-2 border-slate-200 focus:border-gold focus:ring-4 focus:ring-gold/10 rounded-xl px-6 text-base transition-all duration-300 group-hover:border-slate-300 shadow-sm"
                        placeholder="Enter your email address"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="signin-password" className="text-sm font-semibold text-slate-700 flex items-center">
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-16 bg-white border-2 border-slate-200 focus:border-gold focus:ring-4 focus:ring-gold/10 rounded-xl px-6 pr-16 text-base transition-all duration-300 group-hover:border-slate-300 shadow-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-gold transition-all duration-300 p-2 rounded-lg hover:bg-gold/5"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                  
                  {/* Professional Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold-dark text-white font-bold shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] rounded-xl relative overflow-hidden group text-base mt-8" 
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-3" />
                          <span>Access My Account</span>
                        </>
                      )}
                    </div>
                  </Button>
                  
                  {/* Professional forgot password link */}
                  <div className="text-center pt-4">
                    <button
                      type="button"
                      className="text-sm text-slate-500 hover:text-gold transition-colors duration-300 font-medium underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="animate-fade-in">
                <form onSubmit={handleSignUp} className="space-y-5">
                  {/* Personal Information Section */}
                  <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl p-4 border border-border/30">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
                      <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-firstname" className="text-xs font-medium text-muted-foreground">
                          First Name
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-firstname"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                            placeholder="First name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-lastname" className="text-xs font-medium text-muted-foreground">
                          Last Name
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-lastname"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                            placeholder="Last name"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-xs font-medium text-muted-foreground">
                          Email Address
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-phone" className="text-xs font-medium text-muted-foreground">
                            Phone Number
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-dob" className="text-xs font-medium text-muted-foreground">
                            Date of Birth
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-dob"
                              type="date"
                              value={dateOfBirth}
                              onChange={(e) => setDateOfBirth(e.target.value)}
                              className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-xs font-medium text-muted-foreground">
                          Password
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg pr-12 transition-all duration-300 group-hover:border-gold/50"
                            placeholder="Create a secure password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-gold transition-all duration-300 p-1 rounded-lg hover:bg-gold/10"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl p-4 border border-border/30">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
                      <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                      Address Information (Optional)
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-address1" className="text-xs font-medium text-muted-foreground">
                          Address Line 1
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-address1"
                            type="text"
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                            className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                            placeholder="Street address"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-address2" className="text-xs font-medium text-muted-foreground">
                          Address Line 2 (Optional)
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-address2"
                            type="text"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                            className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                            placeholder="Apartment, suite, etc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-city" className="text-xs font-medium text-muted-foreground">
                            City
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-city"
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                              placeholder="City"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-state" className="text-xs font-medium text-muted-foreground">
                            State
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-state"
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                              placeholder="State"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-zip" className="text-xs font-medium text-muted-foreground">
                            ZIP Code
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-zip"
                              type="text"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                              placeholder="ZIP"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-country" className="text-xs font-medium text-muted-foreground">
                            Country
                          </Label>
                          <div className="relative group">
                            <Select value={country} onValueChange={setCountry}>
                              <SelectTrigger className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                                <SelectItem value="United States">United States</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                <SelectItem value="Australia">Australia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Questions Section */}
                  <div className="bg-gradient-to-r from-gold/5 to-gold-light/5 rounded-xl p-4 border border-gold/20">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-gold" />
                      Security Questions
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Security Question 1
                        </Label>
                        <div className="relative group">
                          <Select value={selectedQuestion1} onValueChange={setSelectedQuestion1}>
                            <SelectTrigger className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50">
                              <SelectValue placeholder="Choose your first security question" />
                            </SelectTrigger>
                            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50 max-h-48">
                              {securityQuestions.map((question) => (
                                <SelectItem key={question.id} value={question.id}>
                                  {question.question}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {selectedQuestion1 && (
                          <div className="relative group animate-fade-in">
                            <Input
                              type="text"
                              value={answer1}
                              onChange={(e) => setAnswer1(e.target.value)}
                              className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                              placeholder="Your answer"
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Security Question 2
                        </Label>
                        <div className="relative group">
                          <Select value={selectedQuestion2} onValueChange={setSelectedQuestion2}>
                            <SelectTrigger className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50">
                              <SelectValue placeholder="Choose your second security question" />
                            </SelectTrigger>
                            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50 max-h-48">
                              {securityQuestions.filter(q => q.id !== selectedQuestion1).map((question) => (
                                <SelectItem key={question.id} value={question.id}>
                                  {question.question}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {selectedQuestion2 && (
                          <div className="relative group animate-fade-in">
                            <Input
                              type="text"
                              value={answer2}
                              onChange={(e) => setAnswer2(e.target.value)}
                              className="h-12 bg-background/60 backdrop-blur-sm border-border/50 focus:border-gold focus:ring-gold/20 rounded-lg transition-all duration-300 group-hover:border-gold/50"
                              placeholder="Your answer"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold-dark text-navy-deep font-bold shadow-2xl transition-all duration-500 hover-scale rounded-xl relative overflow-hidden group text-base mt-6" 
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-navy-deep/30 border-t-navy-deep rounded-full animate-spin mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Create My Account
                        </>
                      )}
                    </div>
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
        
        {/* Enhanced Footer Section */}
        <div className="mt-8 space-y-6">
          {/* Features row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="group">
              <div className="w-10 h-10 bg-gradient-to-br from-gold/20 to-gold-light/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-gold" />
              </div>
              <p className="text-xs text-white/70">Bank-Level Security</p>
            </div>
            <div className="group">
              <div className="w-10 h-10 bg-gradient-to-br from-gold/20 to-gold-light/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-gold" />
              </div>
              <p className="text-xs text-white/70">Real-Time Pricing</p>
            </div>
            <div className="group">
              <div className="w-10 h-10 bg-gradient-to-br from-gold/20 to-gold-light/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Gem className="w-5 h-5 text-gold" />
              </div>
              <p className="text-xs text-white/70">Premium Assets</p>
            </div>
          </div>
          
          {/* Footer text */}
          <p className="text-center text-sm text-muted-foreground/80">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </div>

        {/* Bottom decorative elements */}
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
          <div className="h-32 bg-gradient-to-t from-navy-deep/20 to-transparent"></div>
        </div>
        </div>
      </div>
      
      {/* Mobile-responsive decorative elements */}
      <div className="lg:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-8 text-center">
          <div>
            <div className="text-xl font-bold text-gold">$2.5B+</div>
            <p className="text-white/60 text-xs">Assets</p>
          </div>
          <div>
            <div className="text-xl font-bold text-gold">50K+</div>
            <p className="text-white/60 text-xs">Investors</p>
          </div>
          <div>
            <div className="text-xl font-bold text-gold">15+</div>
            <p className="text-white/60 text-xs">Years</p>
          </div>
        </div>
      </div>
    </div>
  );
}