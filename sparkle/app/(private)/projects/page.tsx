import { DataTable } from "@/app/(private)/dashboard/components/data-table";

import data from "./data.json";
import { NewProjectDropdown } from "@/app/(private)/projects/components/new-project-dropdown";

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between">
        <div className="flex gap-1">
          <div className="text-3xl">📁</div>
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque,
              quibusdam.
            </p>
          </div>
        </div>
        <NewProjectDropdown />
      </div>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DataTable data={data} />
      </div>
    </div>
  );
}
