export function Config(overrides) {
  return {
    // Keep the inspector perspective camera position in sync with the A-Frame active camera.
    copyCameraPosition: true,
    // Don't auto-open inspector on example pages so games can run normally
    exampleMode: false,
    ...overrides
  };
}
