import type { Database } from '@/types/database';
import type { PolarRecord } from '@/lib/mockData';
export type Resource = Database['public']['Tables']['resources']['Row'];
export function toPolarRecord(r: Resource): PolarRecord {
  const tags = r.tags || [];
  return { id: r.id, title: r.title, abstract: r.approved_summary || r.description || '', type: r.type === 'dataset' ? 'Dataset' : r.type === 'report' ? 'Report' : 'Media',
    region: (tags.find(t => ['Antarctica','Arctic','Himalaya','Southern Ocean'].includes(t)) || 'Antarctica') as PolarRecord['region'],
    station: tags.find(t => /Station|Base/.test(t)) || 'Not specified', coordinates: 'Not specified', datum: 'Not specified',
    doi: r.doi || '', date: r.created_at.slice(0,10), fileFormat: r.file_path?.split('.').pop()?.toUpperCase() || 'FILE', fileSize: '',
    authors: r.authors || [], tags, status: 'Published', citation: 'Publisher-provided metadata', downloadUrl: '/api/resources/' + r.id + '/file' };
}
