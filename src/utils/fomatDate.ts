import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "dd MMM yyyy 'at' HH:mm");
};
