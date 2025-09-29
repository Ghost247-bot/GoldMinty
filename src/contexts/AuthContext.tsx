import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  requiresSecurityVerification: boolean;
  pendingUserEmail: string | null;
  pendingUserPassword: string | null;
  signUp: (email: string, password: string, fullName: string, additionalData?: any) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; requiresVerification?: boolean }>;
  signOut: () => Promise<void>;
  verifySecurityAnswer: (answer: string) => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [requiresSecurityVerification, setRequiresSecurityVerification] = useState(false);
  const [pendingUserEmail, setPendingUserEmail] = useState<string | null>(null);
  const [pendingUserPassword, setPendingUserPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role
          setTimeout(async () => {
            const { data } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            setUserRole(data?.role || null);
            setLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, additionalData?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          first_name: additionalData?.firstName,
          last_name: additionalData?.lastName,
          phone: additionalData?.phone,
          date_of_birth: additionalData?.dateOfBirth,
          address_line1: additionalData?.addressLine1,
          address_line2: additionalData?.addressLine2,
          city: additionalData?.city,
          state: additionalData?.state,
          zip_code: additionalData?.zipCode,
          country: additionalData?.country,
        },
      },
    });
    
    return { error, data };
  };

  const signIn = async (email: string, password: string) => {
    console.log('SignIn called for:', email);
    
    // Try to sign in first to get the user
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in failed:', error);
      return { error };
    }

    console.log('Sign in successful, checking for security questions...');

    // Now check if this authenticated user has security questions
    if (data.user) {
      const { data: userAnswers, error: queryError } = await supabase
        .from('user_security_answers')
        .select('question_id')
        .eq('user_id', data.user.id)
        .limit(1);

      if (queryError) {
        console.error('Error checking security questions:', queryError);
      } else {
        console.log('Security questions found:', userAnswers?.length || 0);
      }

      if (userAnswers && userAnswers.length > 0) {
        console.log('User has security questions, requiring verification');
        // User has security questions, sign them out and require verification
        await supabase.auth.signOut();
        setPendingUserEmail(email);
        setPendingUserPassword(password);
        setRequiresSecurityVerification(true);
        return { error: null, requiresVerification: true };
      }
    }

    console.log('No security questions found, user signed in');
    // No security questions, user is already signed in
    return { error: null };
  };

  const verifySecurityAnswer = async (answer: string) => {
    console.log('VerifySecurityAnswer called');
    
    if (!pendingUserEmail || !pendingUserPassword) {
      console.error('No pending verification credentials');
      return { error: new Error('No pending verification') };
    }

    try {
      console.log('Signing in to verify answer for:', pendingUserEmail);
      
      // First sign in to get the user ID
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email: pendingUserEmail,
        password: pendingUserPassword,
      });

      if (signInError || !data.user) {
        console.error('Failed to sign in for verification:', signInError);
        return { error: signInError || new Error('Failed to authenticate') };
      }

      console.log('Verifying security answer using edge function for user:', data.user.id);

      // Use edge function to verify the security answer
      const { data: verificationResult, error: functionError } = await supabase.functions.invoke('verify-security-answer', {
        body: {
          user_id: data.user.id,
          answer: answer
        }
      });

      if (functionError) {
        console.error('Error calling verify-security-answer function:', functionError);
        await supabase.auth.signOut();
        return { error: new Error('Verification failed') };
      }

      console.log('Verification result:', verificationResult);

      if (verificationResult?.isValid) {
        console.log('Security verification successful');
        // Verification successful, user is already signed in
        setRequiresSecurityVerification(false);
        setPendingUserEmail(null);
        setPendingUserPassword(null);
        return { error: null };
      } else {
        console.log('Security verification failed - wrong answer');
        // Wrong answer, sign out the user
        await supabase.auth.signOut();
        return { error: new Error('Incorrect security answer') };
      }
    } catch (error) {
      console.error('Unexpected error during verification:', error);
      // Make sure to sign out on any error
      await supabase.auth.signOut();
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRequiresSecurityVerification(false);
    setPendingUserEmail(null);
    setPendingUserPassword(null);
  };

  const value = {
    user,
    session,
    userRole,
    requiresSecurityVerification,
    pendingUserEmail,
    pendingUserPassword,
    signUp,
    signIn,
    signOut,
    verifySecurityAnswer,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}