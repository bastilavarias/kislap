import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  to?: string;
  icon?: boolean;
};
export function BackButton({ children, className, icon, to }: Props) {
  const router = useRouter();

  const handleGoBack = () => {
    if (to) {
      return router.push(to);
    }
    return router.back();
  };

  return (
    <Button variant="secondary" className={cn(className)} onClick={handleGoBack}>
      {icon && <ArrowLeftIcon />}
      {children}
    </Button>
  );
}
