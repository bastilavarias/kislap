import Form from '@/app/(public)/login/components/form';
import { Container } from '@/components/container';

export default function Page() {
  return (
    <Container>
      <div className="h-screen flex items-center justify-center">
        <div className="w-[600px] max-w-[800px]">
          <Form />
        </div>
      </div>
    </Container>
  );
}
