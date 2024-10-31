"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from './use-user';
import { fireStore } from '@/lib/firebase';
import { Order } from '@/types/order';




export const useOrders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const ordersRef = collection(fireStore, 'orders');
        const querySnapshot = await getDocs(ordersRef);

        const fetchedOrders: Order[] = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Order))
          .filter(order => order.items.some(item => item.storeId === user.id));

        setOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return { orders, loading, error };
};
