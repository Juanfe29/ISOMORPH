declare module 'vanta/dist/vanta.birds.min' {
  const BIRDS: (options: Record<string, unknown>) => { destroy: () => void };
  export default BIRDS;
}

declare module 'vanta/dist/vanta.clouds.min' {
  const CLOUDS: (options: Record<string, unknown>) => { destroy: () => void };
  export default CLOUDS;
}
