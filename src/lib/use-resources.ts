"use client";
import { useEffect, useState } from 'react';
import type { PolarRecord } from '@/lib/mockData';
export function useResources() {
  const [records,setRecords] = useState<PolarRecord[]>([]);
  const [notice,setNotice] = useState('Loading published resources…');
  useEffect(()=>{
    const controller = new AbortController();
    fetch('/api/resources',{cache:'no-store',signal:controller.signal}).then(async response=>{
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load resources.');
      setRecords(data.records);
      setNotice(!data.configured ? 'Repository setup pending. No live resources are connected.' : data.records.length ? '' : 'No resources have been published yet.');
    }).catch(error=>{ if (error.name !== 'AbortError') setNotice('Unable to load published resources. Please retry.'); });
    return ()=>controller.abort();
  },[]);
  return {records,notice};
}
