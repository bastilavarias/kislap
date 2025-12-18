import { SettingsForm } from './components/form';

export default function Page() {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <div className="text-3xl">⚙️</div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Update your profile information and notification preferences.
            </p>
          </div>
        </div>
      </div>
      <hr className="border-muted" />
      <SettingsForm />
    </div>
  );
}
