"use client";

import { useState } from "react";
import { Header } from "@/app/(private)/projects/resume/new/_components/header";
import { Form } from "@/app/(private)/projects/resume/new/_components/form";
import { Preview } from '@/app/(private)/projects/resume/new/_components/preview';

export default function Wrapper() {
  const [tab, setTab] = useState("edit");

  return (
    <div className="flex flex-col gap-12">
      <Header tab={tab} onTabChange={setTab} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {
          tab === 'edit' ? <Form/> : <Preview/>
        }
      </div>
    </div>
  );
}
