export const getLSKTokenId = async (chainIdPrefix) => {
  if (chainIdPrefix.length !== 2)
    throw new Error("invalid chainIdPrefix length");
  return `${chainIdPrefix}00000000000000`;
};
