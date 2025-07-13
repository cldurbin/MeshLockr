import OnboardingForm from './components/OnboardingForm';
import InviteTeammatesForm from './components/InviteTeammatesForm';

interface OnboardingPageProps {
  searchParams: {
    step?: string;
    orgId?: string;
  };
}

export default function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const step = searchParams?.step ?? 'create';
  const orgId = searchParams?.orgId;

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
