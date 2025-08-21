declare module '@mdx-js/runtime' {
  import { ComponentType } from 'react';
  
  export function evaluate(
    mdxCode: string,
    options?: any
  ): Promise<{ default: ComponentType }>;
  
  export const MDXProvider: ComponentType<{ children: React.ReactNode; components?: any }>;
}