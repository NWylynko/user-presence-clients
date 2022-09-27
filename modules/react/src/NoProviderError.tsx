export const NoProviderError = () => {
  throw new Error(`You are trying to call this function outside of the provider :(`);
};
