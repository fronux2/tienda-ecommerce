"use client"
import { useLoadCart } from '@/hooks/useLoadCart';

export default function CartInitializer() {
  useLoadCart();
  return null;
}