import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page when the component mounts
    router.push('/login');
  }, []);

  return null; // This component doesn't render anything
}
