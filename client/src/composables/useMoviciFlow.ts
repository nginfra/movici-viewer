import LocalBackend from "@/api/LocalBackend";
import { useMainStore } from "@/stores/main";
import { useFlowStore } from "@nginfra/movici-flow-lib/stores/flow";

export function useMoviciFlow() {
  function setupMoviciFlow() {
    const flowStore = useFlowStore();
    const mainStore = useMainStore();

    flowStore.backend = new LocalBackend(mainStore.client);
  }
  return { setupMoviciFlow };
}
