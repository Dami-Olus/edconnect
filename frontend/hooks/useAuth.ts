import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();

  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return { saveToken, logout };
};
