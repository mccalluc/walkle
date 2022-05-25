export default function getInit(defaults) {
  const overrides = Object.fromEntries(
    new URLSearchParams(location.hash.slice(1))
  );

  // TODO

  return {
    ...defaults, ...overrides,
  }
}