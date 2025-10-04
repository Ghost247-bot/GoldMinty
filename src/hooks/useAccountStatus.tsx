import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AccountStatus {
  isFrozen: boolean;
  frozenAt: string | null;
  frozenBy: string | null;
  freezeReason: string | null;
  customFreezeTitle: string | null;
  customFreezeMessage: string | null;
  customFreezeContactInfo: string | null;
  showContact: boolean;
  showReason: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAccountStatus() {
  const { user } = useAuth();
  const [accountStatus, setAccountStatus] = useState<AccountStatus>({
    isFrozen: false,
    frozenAt: null,
    frozenBy: null,
    freezeReason: null,
    customFreezeTitle: null,
    customFreezeMessage: null,
    customFreezeContactInfo: null,
    showContact: true,
    showReason: true,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!user) {
      setAccountStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchAccountStatus = async () => {
      try {
        setAccountStatus(prev => ({ ...prev, isLoading: true, error: null }));

        const { data, error } = await supabase
          .from('profiles')
          .select('account_frozen, frozen_at, frozen_by, freeze_reason, custom_freeze_title, custom_freeze_message, custom_freeze_contact_info, custom_freeze_show_contact, custom_freeze_show_reason')
          .eq('user_id', user.id)
          .single();

        if (error) {
          // If columns don't exist yet, assume account is not frozen
          if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('does not exist')) {
            console.log('Freeze columns not found, assuming account is not frozen');
            setAccountStatus({
              isFrozen: false,
              frozenAt: null,
              frozenBy: null,
              freezeReason: null,
              customFreezeTitle: null,
              customFreezeMessage: null,
              customFreezeContactInfo: null,
              showContact: true,
              showReason: true,
              isLoading: false,
              error: null
            });
            return;
          }
          throw error;
        }

        setAccountStatus({
          isFrozen: data?.account_frozen || false,
          frozenAt: data?.frozen_at || null,
          frozenBy: data?.frozen_by || null,
          freezeReason: data?.freeze_reason || null,
          customFreezeTitle: data?.custom_freeze_title || null,
          customFreezeMessage: data?.custom_freeze_message || null,
          customFreezeContactInfo: data?.custom_freeze_contact_info || null,
          showContact: data?.custom_freeze_show_contact !== false,
          showReason: data?.custom_freeze_show_reason !== false,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching account status:', error);
        setAccountStatus(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch account status'
        }));
      }
    };

    fetchAccountStatus();
  }, [user]);

  const refreshAccountStatus = async () => {
    if (!user) return;

    try {
      setAccountStatus(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase
        .from('profiles')
        .select('account_frozen, frozen_at, frozen_by, freeze_reason, custom_freeze_title, custom_freeze_message, custom_freeze_contact_info, custom_freeze_show_contact, custom_freeze_show_reason')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If columns don't exist yet, assume account is not frozen
        if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('does not exist')) {
          console.log('Freeze columns not found, assuming account is not frozen');
          setAccountStatus({
            isFrozen: false,
            frozenAt: null,
            frozenBy: null,
            freezeReason: null,
            customFreezeTitle: null,
            customFreezeMessage: null,
            customFreezeContactInfo: null,
            showContact: true,
            showReason: true,
            isLoading: false,
            error: null
          });
          return;
        }
        throw error;
      }

      setAccountStatus({
        isFrozen: data?.account_frozen || false,
        frozenAt: data?.frozen_at || null,
        frozenBy: data?.frozen_by || null,
        freezeReason: data?.freeze_reason || null,
        customFreezeTitle: data?.custom_freeze_title || null,
        customFreezeMessage: data?.custom_freeze_message || null,
        customFreezeContactInfo: data?.custom_freeze_contact_info || null,
        showContact: data?.custom_freeze_show_contact !== false,
        showReason: data?.custom_freeze_show_reason !== false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error refreshing account status:', error);
      setAccountStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh account status'
      }));
    }
  };

  return {
    ...accountStatus,
    refreshAccountStatus
  };
}
