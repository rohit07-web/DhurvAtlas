import { requireAdmin, apiError, AccessError, requireSameOrigin } from '@/lib/access';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const { db, user } = await requireAdmin();
    if (Number(request.headers.get('content-length')) > 11 * 1024 * 1024) throw new AccessError('Maximum file size is 10 MB.',413);
    const form = await request.formData();
    const file = form.get('file');
    const title = String(form.get('title') || '').trim();
    const type = String(form.get('type') || '');
    const description = String(form.get('description') || '').trim();
    const doi = String(form.get('doi') || '').trim();
    if (!title || title.length > 240 || description.length > 30000) throw new AccessError('Enter a title (up to 240 characters) and description (up to 30,000).',400);
    if (!['report','dataset','image','video'].includes(type)) throw new AccessError('Invalid resource type.',400);
    if (!(file instanceof File) || !file.size || file.size > 10 * 1024 * 1024) throw new AccessError('Choose a file between 1 byte and 10 MB.',400);
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowed: Record<string,string> = { pdf:'application/pdf',txt:'text/plain',csv:'text/csv',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',mp4:'video/mp4' };
    if (!allowed[extension]) throw new AccessError('Supported formats: PDF, TXT, CSV, PNG, JPG, WEBP, MP4.',400);
    if (doi && !/^10\.\d{4,9}\/\S+$/.test(doi)) throw new AccessError('Enter an existing DOI, or leave it blank. This portal does not register DOIs.',400);
    const path = user.id + '/' + crypto.randomUUID() + '.' + extension;
    const bytes = Buffer.from(await file.arrayBuffer());
    if (extension === 'pdf' && bytes.subarray(0,5).toString() !== '%PDF-') throw new AccessError('The selected file is not a PDF.',400);
    const { error: uploadError } = await db.storage.from('polar_archive').upload(path,bytes,{ contentType:allowed[extension],upsert:false,cacheControl:'0' });
    if (uploadError) throw new Error('Storage upload failed');
    const tags = [String(form.get('region') || ''),String(form.get('station') || ''),...String(form.get('tags') || '').split(',')].map(s=>s.trim()).filter(Boolean).slice(0,20);
    const { data: resource, error } = await db.from('resources').insert({
      title, type:type as 'report'|'dataset'|'image'|'video', description, doi:doi || null, file_path:path,
      source_url:null, publication_status:'draft', tags,
      authors:String(form.get('authors') || '').split(',').map(s=>s.trim()).filter(Boolean)
    }).select('*').single();
    if (error) {
      await db.storage.from('polar_archive').remove([path]);
      throw new Error('Resource could not be saved');
    }
    return Response.json({ resource },{ status:201 });
  } catch(error) { return apiError(error); }
}
