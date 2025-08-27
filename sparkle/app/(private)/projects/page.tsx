import { DataTable } from "@/app/(private)/dashboard/_components/data-table";

import data from "./data.json";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col items-start justify-center px-4 lg:px-6">
        <h1 className="text-3xl font-bold">📁 Projects</h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque,
          quibusdam.
        </p>
      </div>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DataTable data={data} />
      </div>
    </div>
  );
}
