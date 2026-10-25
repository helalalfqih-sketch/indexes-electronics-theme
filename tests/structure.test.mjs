import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const json=p=>JSON.parse(read(p).replace(/\/\*[\s\S]*?\*\//g,''));
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${d}/${e.name}`):[`${d}/${e.name}`]);
const files=['assets','blocks','config','layout','locales','sections','snippets','templates'].flatMap(walk);
const keys=(o,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'?keys(v,`${p}${k}.`):[`${p}${k}`]);
test('all theme JSON and embedded schemas parse; setting IDs are unique in each scope',()=>{
 for(const file of files){if(file.endsWith('.json'))json(file);if(file.endsWith('.liquid')){const match=read(file).match(/{% schema %}([\s\S]*?){% endschema %}/);if(match){const s=JSON.parse(match[1]);for(const scope of [s,...(s.blocks||[])]){const ids=(scope.settings||[]).filter(x=>x.id).map(x=>x.id);assert.equal(new Set(ids).size,ids.length,file);}}}
 }});
test('every JSON template references real sections and valid order entries',()=>{for(const file of walk('templates').filter(p=>p.endsWith('.json'))){const t=json(file);for(const id of t.order)assert.ok(t.sections[id],file);for(const s of Object.values(t.sections))assert.ok(existsSync(`sections/${s.type}.liquid`),file);}});
test('Arabic and English storefront locale keys match',()=>assert.deepEqual(keys(json('locales/ar.json')).sort(),keys(json('locales/en.default.json')).sort()));
test('preview-only tags are absent from shipped Liquid',()=>{for(const f of files.filter(p=>p.endsWith('.liquid')))assert.doesNotMatch(read(f),/{%-?\s*(block|partial)\s/,f);});
test('product default composition has purchase controls and app-block support',()=>{const t=json('templates/product.json').sections.main;assert.ok(t.block_order.includes('buy_buttons'));const source=read('sections/product.liquid');assert.match(source,/"type":"@app"/);assert.match(source,/form 'product'/);assert.match(source,/current_variant.available/);});
test('no private store identity or credential patterns in shipped files',()=>{for(const f of files)assert.doesNotMatch(read(f),/indexesstore\.com|967771370740|shpat_[a-zA-Z0-9]+|ghp_[a-zA-Z0-9]{20,}/,f);});
