import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

export const convertQueryToState = (
  query: string | null,
  defaultValue: number
): number => {
  return query ? parseInt(query, 10) : defaultValue;
};
