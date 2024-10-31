import { getFirstWordCharacters } from "./AccountName";

export const getAvatarByName = (name: string): string => {
  return `https://i2.wp.com/cdn.auth0.com/avatars/${getFirstWordCharacters(
    name
  ).toLocaleLowerCase()}.png`;
};
