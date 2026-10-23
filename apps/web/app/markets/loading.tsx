import { ModuleLoadingState } from '@nexfield/ui';

export default function MarketsLoading() {
  return <ModuleLoadingState message="Connecting to Agmarknet live price feeds and computing spatial arbitrage..." />;
}
