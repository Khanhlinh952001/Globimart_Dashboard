import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import { fireStore, storage } from '@/lib/firebase';
import { type ProductPull } from '@/types/products';
import { useUser } from '@/hooks/use-user';

const useProduct = () => {
  const router = useRouter();
  const { user } = useUser();
  const [products, setProducts] = useState<ProductPull[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (user && user.id) {
        setLoading(true);
        try {
          const productsRef = collection(fireStore, 'products');
          const q = query(productsRef, where('storeId', '==', user.id));
          const querySnapshot = await getDocs(q);
          const fetchedProducts: ProductPull[] = [];
          querySnapshot.forEach((doc) => {
            fetchedProducts.push({ id: doc.id, ...doc.data() } as ProductPull);
          });
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [user]);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/products/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeleting(true);
      try {
        const productDoc = await getDoc(doc(fireStore, 'products', id));
        const productData = productDoc.data() as ProductPull;

        if (productData.images && productData.images.length > 0) {
          for (const imageUrl of productData.images) {
            if (imageUrl && imageUrl.startsWith('gs://')) {
              const imageRef = ref(storage, imageUrl);
              await deleteObject(imageRef);
            } else {
              console.warn(`Invalid URL: ${imageUrl}`);
            }
          }
        }

        await deleteDoc(doc(fireStore, 'products', id));
        setProducts(products.filter((product) => product.id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('An error occurred while deleting the product');
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleAddToFlashSales = async (product: ProductPull) => {
    if (window.confirm('Are you sure you want to add this product to flash sales?')) {
      try {
        const discountedProduct = {
          ...product,
          sales: Number(product.sales) * 0.9,
        };

        await setDoc(doc(fireStore, 'flashSales', discountedProduct.id), discountedProduct);
        toast.success('Product added to flash sales successfully');
      } catch (error) {
        console.error('Error adding product to flash sales:', error);
        toast.error('An error occurred while adding the product to flash sales');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const shortenId = (id: string) => {
    return `${id.slice(0, 6)}...`;
  };

  return {
    products,
    loading,
    deleting,
    handleEdit,
    handleDelete,
    handleAddToFlashSales,
    formatDate,
    shortenId,
  };
};

export default useProduct;
