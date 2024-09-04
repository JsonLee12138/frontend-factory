const modules = import.meta.glob('../pages/**/index.tsx');

export const routeModules = Object.keys(modules).map(
  (key) => key.split('pages')[1],
);
