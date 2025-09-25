'use client';

import { useState } from 'react';
import { Form } from '@/app/(private)/projects/builder/portfolio/new/components/form';
import { FormHeader } from '@/components/form-header';
import { BackButton } from '@/components/back-button';

export default function Wrapper() {
  const [tab, setTab] = useState('edit');

  return (
    <div>
      <BackButton className="mb-5" icon={true}>
        Go back
      </BackButton>
      <div className="flex flex-col gap-10">
        <FormHeader tab={tab} onTabChange={setTab} />
        <div className="w-full">{tab === 'edit' ? <Form /> : <h1>Overview</h1>}</div>
      </div>
    </div>
  );
}
