import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  icon?: boolean
};
export function BackButton({children, className, icon}: Props) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Button variant="secondary" className={cn( className)} onClick={handleGoBack}>
      {icon && <ArrowLeftIcon/>}
      {children}
    </Button>
  )
}
