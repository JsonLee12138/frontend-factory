export interface RouterItem {
  path: string;
  name: string;
  component: React.ComponentType;
  children?: RouterItem[];
  meta?: {
    title?: string;
    icon?: string;
    keepAlive?: boolean;
    hidden?: boolean;
    redirect?: string;
    link?: string;
  };
}
