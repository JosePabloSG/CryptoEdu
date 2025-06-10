import { useQuery } from '@tanstack/react-query';
import { HomepageData } from '@/lib/types/homepage';

async function fetchHomepageData(): Promise<HomepageData> {
  const response = await fetch('/api/homepage');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function useHomepageData() {
  return useQuery<HomepageData>({
    queryKey: ['homepage'],
    queryFn: fetchHomepageData,
  });
}
