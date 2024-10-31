export const getFirstWordCharacters = (name: string): string => {
  const trimName = name.trim();
  if (trimName === "") return "";
  const words = name.split(" ");
  if (words.length > 1) return `${words[words.length - 1][0]}${words[0][0]}`;
  return words[0][0];
};
