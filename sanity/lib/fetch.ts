import type { QueryParams } from 'next-sanity';
import { client } from '@/sanity/lib/client';

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: 60, // ISR: revalidate every 60 seconds
      tags,
    },
  });
}
