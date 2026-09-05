'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api';


export function useResource<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    fetcher()
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        const message = cause instanceof ApiError ? cause.message : 'Failed to load data';
        setError(message);
      });
    return () => {
      active = false;
    };
  }, [fetcher, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { data, error, loading: data === null && error === null, reload };
}
