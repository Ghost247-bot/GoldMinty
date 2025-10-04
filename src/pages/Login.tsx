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
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      
      {/* Clean professional grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }}
        ></div>
      </div>
      
      {/* Subtle background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-slate-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-slate-700/15 rounded-full blur-3xl"></div>
      </div>

      {/* Clean professional side panels */}
      <div className="absolute inset-y-0 left-0 w-1/4 hidden xl:block">
        <div className="h-full flex flex-col justify-center items-start space-y-12 px-12">
          {/* Company credentials */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center shadow-lg border border-slate-600/30">
                <Award className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">SEC Registered</h3>
                <p className="text-white/60 text-sm">Fully compliant investment platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center shadow-lg border border-slate-600/30">
                <Shield className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bank-Grade Security</h3>
                <p className="text-white/60 text-sm">256-bit encryption & multi-factor auth</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center shadow-lg border border-slate-600/30">
                <CheckCircle className="w-6 h-6 text-slate-300" />
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
                <Star className="w-4 h-4 text-slate-400 fill-slate-400" />
                <span className="text-white/70 text-sm">Best Precious Metals Platform 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-slate-400 fill-slate-400" />
                <span className="text-white/70 text-sm">FinTech Innovation Award</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-slate-400 fill-slate-400" />
                <span className="text-white/70 text-sm">A+ Better Business Bureau</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean statistics panel */}
      <div className="absolute inset-y-0 right-0 w-1/4 hidden xl:block">
        <div className="h-full flex flex-col justify-center items-end space-y-12 px-12">
          {/* Key metrics */}
          <div className="text-right space-y-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">
                $2.5B+
              </div>
              <p className="text-white/60 text-sm font-medium">Assets Under Management</p>
              <div className="w-16 h-0.5 bg-slate-400 ml-auto"></div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">
                50,000+
              </div>
              <p className="text-white/60 text-sm font-medium">Global Investors</p>
              <div className="w-16 h-0.5 bg-slate-400 ml-auto"></div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">
                99.9%
              </div>
              <p className="text-white/60 text-sm font-medium">Platform Uptime</p>
              <div className="w-16 h-0.5 bg-slate-400 ml-auto"></div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider text-right">Global Presence</h4>
            <div className="space-y-3 text-right">
              <div className="flex items-center justify-end space-x-2">
                <span className="text-white/70 text-sm">Available in 50+ countries</span>
                <Globe className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-white/70 text-sm">24/7 customer support</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-white/70 text-sm">Instant settlements</span>
                <Zap className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Enhanced professional back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-12 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 group backdrop-blur-md border border-white/20 rounded-full px-8 h-12 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Return to Homepage</span>
          </Button>

          {/* Modern professional main card */}
          <Card className="shadow-2xl border border-slate-700/30 bg-white/95 backdrop-blur-3xl relative overflow-hidden rounded-3xl">
            {/* Clean card accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/20"></div>
            
            <CardHeader className="text-center pb-12 pt-16 relative">
              {/* Modern professional logo design */}
              <div className="flex justify-center mb-10">
                <div className="relative group">
                  {/* Main logo container */}
                  <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden border border-slate-300">
                    <Gem className="w-14 h-14 text-slate-800 relative z-10" />
                  </div>
                  {/* Enhanced shadow */}
                  <div className="absolute inset-0 bg-slate-300/30 rounded-2xl blur-2xl opacity-40 scale-110 -z-10"></div>
                </div>
              </div>
              
              {/* Clean branding */}
              <div className="space-y-6">
                <CardTitle className="text-6xl font-bold text-slate-800 tracking-tight">
                  GoldMint
                </CardTitle>
                <div className="w-40 h-1 bg-slate-300 mx-auto rounded-full"></div>
                <CardDescription className="text-slate-600 text-xl font-medium leading-relaxed max-w-lg mx-auto">
                  Premium precious metals investment platform trusted by institutions worldwide
                </CardDescription>
              </div>
              
              {/* Clean trust badges */}
              <div className="flex justify-center items-center space-x-8 mt-10">
                <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold">SEC Registered</span>
                </div>
                <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
                <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <Shield className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold">FDIC Insured</span>
                </div>
                <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
                <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <Award className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold">A+ BBB Rating</span>
                </div>
              </div>
            </CardHeader>
          
          <CardContent className="pb-8 px-8">
            <Tabs defaultValue="signin" className="w-full">
              {/* Modern tab navigation */}
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-slate-100/90 backdrop-blur-sm rounded-xl p-1 border border-slate-200 shadow-lg">
                <TabsTrigger 
                  value="signin" 
                  className="text-sm font-semibold rounded-lg h-10 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-lg transition-all duration-300 data-[state=active]:shadow-slate-200/50"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Sign In</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="text-sm font-semibold rounded-lg h-10 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-lg transition-all duration-300 data-[state=active]:shadow-slate-200/50"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Create Account</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              {/* Modern Sign In Form */}
              <TabsContent value="signin" className="animate-fade-in">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-medium text-slate-700 flex items-center">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-lg px-4 text-sm transition-all duration-300 group-hover:border-slate-300 shadow-sm"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-slate-700 flex items-center">
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-lg px-4 pr-12 text-sm transition-all duration-300 group-hover:border-slate-300 shadow-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-300 p-1 rounded hover:bg-slate-100"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Modern Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] rounded-lg relative overflow-hidden group text-sm mt-4" 
                    disabled={loading}
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          <span>Sign In</span>
                        </>
                      )}
                    </div>
                  </Button>
                  
                  {/* Modern forgot password link */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-300 font-medium underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="animate-fade-in">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Personal Information Section */}
                  <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-2"></div>
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1">
                        <Label htmlFor="signup-firstname" className="text-xs font-medium text-slate-700">
                          First Name
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-firstname"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                            placeholder="First name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="signup-lastname" className="text-xs font-medium text-slate-700">
                          Last Name
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-lastname"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                            placeholder="Last name"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="signup-email" className="text-xs font-medium text-slate-700">
                          Email Address
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="signup-phone" className="text-xs font-medium text-slate-700">
                            Phone Number
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="signup-dob" className="text-xs font-medium text-slate-700">
                            Date of Birth
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-dob"
                              type="date"
                              value={dateOfBirth}
                              onChange={(e) => setDateOfBirth(e.target.value)}
                              className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="signup-password" className="text-xs font-medium text-slate-700">
                          Password
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md pr-10 transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                            placeholder="Create a secure password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-300 p-1 rounded hover:bg-slate-100"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-2"></div>
                      Address Information (Optional)
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="signup-address1" className="text-xs font-medium text-slate-700">
                          Address Line 1
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-address1"
                            type="text"
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                            className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                            placeholder="Street address"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="signup-address2" className="text-xs font-medium text-slate-700">
                          Address Line 2 (Optional)
                        </Label>
                        <div className="relative group">
                          <Input
                            id="signup-address2"
                            type="text"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                            className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                            placeholder="Apartment, suite, etc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="signup-city" className="text-xs font-medium text-slate-700">
                            City
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-city"
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                              placeholder="City"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="signup-state" className="text-xs font-medium text-slate-700">
                            State
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-state"
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                              placeholder="State"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="signup-zip" className="text-xs font-medium text-slate-700">
                            ZIP Code
                          </Label>
                          <div className="relative group">
                            <Input
                              id="signup-zip"
                              type="text"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                              placeholder="ZIP"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="signup-country" className="text-xs font-medium text-slate-700">
                            Country
                          </Label>
                          <div className="relative group">
                            <Select value={country} onValueChange={setCountry}>
                              <SelectTrigger className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-slate-200 shadow-lg">
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
                  <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-slate-600" />
                      Security Questions
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-700">
                          Security Question 1
                        </Label>
                        <div className="relative group">
                          <Select value={selectedQuestion1} onValueChange={setSelectedQuestion1}>
                            <SelectTrigger className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm">
                              <SelectValue placeholder="Choose your first security question" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-lg max-h-48">
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
                              className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                              placeholder="Your answer"
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-700">
                          Security Question 2
                        </Label>
                        <div className="relative group">
                          <Select value={selectedQuestion2} onValueChange={setSelectedQuestion2}>
                            <SelectTrigger className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm">
                              <SelectValue placeholder="Choose your second security question" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-lg max-h-48">
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
                              className="h-9 bg-white border-2 border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-md transition-all duration-300 group-hover:border-slate-300 shadow-sm text-sm"
                              placeholder="Your answer"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Modern Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] rounded-lg relative overflow-hidden group text-sm mt-4" 
                    disabled={loading}
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Create Account
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

            {/* Clean Trust indicators */}
            <div className="mt-12 pt-8 border-t-2 border-slate-200/30">
              <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
                <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Secure</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                  <span className="font-semibold">Trusted</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <Gem className="w-5 h-5 text-slate-600" />
                  <span className="font-semibold">Premium</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Clean Footer Section */}
        <div className="mt-12 space-y-8">
          {/* Clean Features row */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="group">
              <div className="w-14 h-14 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform shadow-lg border border-slate-600/30">
                <Shield className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm text-white/80 font-medium">Bank-Level Security</p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform shadow-lg border border-slate-600/30">
                <TrendingUp className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm text-white/80 font-medium">Real-Time Pricing</p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform shadow-lg border border-slate-600/30">
                <Gem className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm text-white/80 font-medium">Premium Assets</p>
            </div>
          </div>
          
          {/* Clean Footer text */}
          <p className="text-center text-base text-white/70 font-medium">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </div>

        {/* Bottom decorative elements */}
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
          <div className="h-32 bg-gradient-to-t from-navy-deep/20 to-transparent"></div>
        </div>
        </div>
      </div>
      
      {/* Clean Mobile-responsive decorative elements */}
      <div className="lg:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <div className="text-2xl font-bold text-white">$2.5B+</div>
            <p className="text-white/70 text-sm font-medium">Assets</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <div className="text-2xl font-bold text-white">50K+</div>
            <p className="text-white/70 text-sm font-medium">Investors</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <div className="text-2xl font-bold text-white">15+</div>
            <p className="text-white/70 text-sm font-medium">Years</p>
          </div>
        </div>
      </div>
    </div>
  );
}