import OnboardingForm from './components/OnboardingForm';
import InviteTeammatesForm from './components/InviteTeammatesForm';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const step = typeof searchParams?.step === 'string' ? searchParams.step : 'create';
  const orgId = typeof searchParams?.orgId === 'string' ? searchParams.orgId : undefined;

  return (
    <div className="max-w-xl mx-auto py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Welcome to MeshLockr 👋</h1>

      {step === 'invite' && orgId ? (
        <InviteTeammatesForm orgId={orgId} />
      ) : (
        <OnboardingForm />
      )}
    </div>
  );
}
