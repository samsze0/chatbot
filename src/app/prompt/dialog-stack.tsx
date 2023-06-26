import {
  generateUseDialogStackStore,
  generateDialogStack,
  generateDialogStackItem,
} from "@artizon/ui";

export const usePromptDialogStack = generateUseDialogStackStore();
export const PromptDialogStackItem =
  generateDialogStackItem(usePromptDialogStack);

const Stack = generateDialogStack(usePromptDialogStack);

export const PromptDialogStack = () => {
  return <Stack />;
};
