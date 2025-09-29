import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  requiresSecurityVerification: boolean;
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
    // First check if user has security questions before actual sign in
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', email)
      .single();

    if (existingUser) {
      const { data: userAnswers } = await supabase
        .from('user_security_answers')
        .select('question_id')
        .eq('user_id', existingUser.user_id)
        .limit(1);

      if (userAnswers && userAnswers.length > 0) {
        // User has security questions, store credentials and require verification
        setPendingUserEmail(email);
        setPendingUserPassword(password);
        setRequiresSecurityVerification(true);
        return { error: null, requiresVerification: true };
      }
    }

    // No security questions or user not found, proceed with normal login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const verifySecurityAnswer = async (answer: string) => {
    if (!pendingUserEmail || !pendingUserPassword) {
      return { error: new Error('No pending verification') };
    }

    try {
      // First get the user ID from email
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', pendingUserEmail)
        .single();

      if (!profile) {
        return { error: new Error('User not found') };
      }

      // Get the user's security question and verify answer
      const { data: userAnswer } = await supabase
        .from('user_security_answers')
        .select(`
          answer_hash,
          security_questions!inner(question)
        `)
        .eq('user_id', profile.user_id)
        .limit(1)
        .single();

      if (!userAnswer) {
        return { error: new Error('Security answer not found') };
      }

      if (userAnswer.answer_hash === btoa(answer.toLowerCase().trim())) {
        // Verification successful, complete the login
        const { error } = await supabase.auth.signInWithPassword({
          email: pendingUserEmail,
          password: pendingUserPassword,
        });
        
        if (!error) {
          setRequiresSecurityVerification(false);
          setPendingUserEmail(null);
          setPendingUserPassword(null);
        }
        
        return { error };
      } else {
        return { error: new Error('Incorrect security answer') };
      }
    } catch (error) {
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