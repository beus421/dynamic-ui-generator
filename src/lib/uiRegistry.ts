import Button from '../components/Button';

export const uiRegistry: Record<string, React.ComponentType<any>> = {
  Button
};

export type UIInstruction = {
  component: string;
  props: Record<string, any>;
}; 