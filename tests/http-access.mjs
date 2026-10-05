import assert from 'node:assert/strict';
const base='http://127.0.0.1:3000';
for(const path of ['/admin','/admin/upload','/admin/review']) {
 const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,307);assert.equal(r.headers.get('location'),'/login');console.log('PASS logged-out '+path+' redirects to login');
}
for(const path of ['/api/upload','/api/generate-summary']) {
 const r=await fetch(base+path,{method:'POST',headers:{origin:base,'Content-Type':'application/json'},body:'{}'});assert.equal(r.status,401,await r.text());console.log('PASS unauthenticated '+path+' denied');
 const cross=await fetch(base+path,{method:'POST',headers:{origin:'https://untrusted.example','Content-Type':'application/json'},body:'{}'});assert.equal(cross.status,403);console.log('PASS cross-origin '+path+' denied');
}
const r=await fetch(base+'/api/resources');assert.equal(r.status,200);const data=await r.json();assert.equal(data.configured,true);assert.ok(Array.isArray(data.records));console.log('PASS public API connected to Supabase; published resources: '+data.records.length);
const file=await fetch(base+'/api/resources/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/file');assert.equal(file.status,404);console.log('PASS nonexistent file hidden');
