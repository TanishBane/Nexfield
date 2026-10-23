import { ModuleLoadingState } from '@nexfield/ui';

export default function OpsLoading() {
  return <ModuleLoadingState message="Loading farm operational ledgers, inventory balances, and task queues..." />;
}
