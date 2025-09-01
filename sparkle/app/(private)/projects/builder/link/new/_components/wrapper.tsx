"use client";

import { useState } from "react";
import { Form } from "@/app/(private)/projects/builder/link/new/_components/form";
import { Preview } from '@/app/(private)/projects/builder/link/new/_components/preview';
import { FormHeader } from '@/components/form-header';

export default function Wrapper() {
  const [tab, setTab] = useState("edit");

  return (
    <div className="flex flex-col gap-12">
      <FormHeader tab={tab} onTabChange={setTab} />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {
          tab === 'edit' ? <Form/> : <Preview/>
        }
      </div>
    </div>
  );
}
