// src/hooks/useLoadCart.ts
"use client"
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/utils/supabase/client';

export function useLoadCart() {
  const { loadCart } = useCart();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        await loadCart(user.id);
      }
    };

    fetchUserAndCart();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.id) {
          await loadCart(session.user.id);
        }
        if (event === 'SIGNED_OUT') {
          loadCart('');
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [loadCart, supabase]);
}