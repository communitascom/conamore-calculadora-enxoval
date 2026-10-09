// Grade combinatória AMOSTRADA (não são todos os inteiros até 2.000): roda calcular() do index.html e confere invariantes.
// Uso: node testes/simulacao.js [--csv f.csv]   (leva ~1 min)
// Os invariantes só pegam o que alguém pensou em checar: somar com a revisão manual e os 6 casos de regressão do README.
const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const a=html.indexOf('const SEG = '), b=html.indexOf('/* ========== whatsapp');
const E=new Function(html.slice(a,b)+'\nreturn {state, calcular, SEG, TAM, CAMA, FREQ, TAT, DESCANSO, tamanhos};')();
const {state,calcular}=E;
const SEGS=['hotel','airbnb','hospitalar','motel'];
const LEITOS=[1,2,3,5,10,20,50,200,2000];
const BANH=[1,2,3,5,10,20,50,200,2000];
const OCUP=[20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100];
const LOC=[1,2,3,4,5,6,7,8,9,10];
const LAV=['interna','terceirizada'];
const TROCA=['diaria','alternada','saida'];
const MARG=['com','sem'];
const PERFIS={casal:n=>({solteiro:0,casal:n,queen:0,king:0}), solteiro:n=>({solteiro:n,casal:0,queen:0,king:0}), king:n=>({solteiro:0,casal:0,queen:0,king:n}),
  misto:n=>{const a=Math.floor(n/2);return {solteiro:a,casal:n-a,queen:0,king:0}}, semEscolha:n=>({solteiro:0,casal:0,queen:0,king:0}),
  quatro:n=>{const q=Math.floor(n/4);return {solteiro:q,casal:q,queen:q,king:n-3*q}}};
const rows=[]; let n=0;
function um(o){
  Object.assign(state,{ocupacao:null,locacoes:3,trocaCama:'diaria',trocaToalha:'diaria'},o);
  state.tam=o.tam;
  const r=calcular(); n++;
  const g=r.grupos; const banho=g[1].itens;
  return {...o,tam:undefined,perfil:o.perfil,r,
    cama:g[0].total, banhoTot:g[1].total, total:r.total,
    toalhaBanho:banho[0][2], toalhaRosto:banho[1][2], toalhaPiso:banho[2][2], minVale:r.banhoPiso, hospedes:r.hospedesDia,
    ciclo:r.ciclo, conta:g[1].conta, contaCama:g[0].conta, itensCama:g[0].itens.map(i=>i[2]), tamEf:r.tam};
}
const key=o=>JSON.stringify([o.segmento,o.leitos,o.banheiros,o.perfil,o.ocupacao,o.locacoes,o.lavanderia,o.trocaCama,o.trocaToalha,o.margem]);
const mapa=new Map();
for(const segmento of SEGS){ const motel=segmento==='motel';
 for(const leitos of LEITOS) for(const banheiros of BANH) for(const perfil of Object.keys(PERFIS))
 for(const ocup of (motel?[null]:OCUP)) for(const loc of (motel?LOC:[3]))
 for(const lavanderia of LAV) for(const tc of (motel?['diaria']:TROCA)) for(const tt of (motel?['diaria']:TROCA)) for(const margem of MARG){
  const o={segmento,leitos,banheiros,perfil,tam:PERFIS[perfil](leitos),ocupacao:ocup,locacoes:loc,lavanderia,trocaCama:tc,trocaToalha:tt,margem};
  const x=um(o); mapa.set(key(o),x); rows.push(x);
 }}
console.log('combinações simuladas (grade amostrada):',n);
const viol={};
function v(nome,x,det){ (viol[nome]=viol[nome]||{n:0,ex:[]}); viol[nome].n++; if(viol[nome].ex.length<4) viol[nome].ex.push({seg:x.segmento,leitos:x.leitos,banh:x.banheiros,perfil:x.perfil,ocup:x.ocupacao,loc:x.locacoes,lav:x.lavanderia,tc:x.trocaCama,tt:x.trocaToalha,marg:x.margem,det}); }
for(const x of rows){
  const r=x.r;
  const todos=[x.cama,x.banhoTot,x.total,x.toalhaBanho,x.toalhaRosto,x.toalhaPiso,...x.itensCama];
  if(todos.some(t=>!Number.isInteger(t)||t<0||Number.isNaN(t))) v('I1 valor não inteiro/negativo/NaN',x,todos.join());
  if(Object.values(x.tamEf).reduce((a,b)=>a+b,0)!==x.leitos) v('I2 soma dos tamanhos != camas',x,JSON.stringify(x.tamEf));
  if(x.toalhaPiso<x.banheiros) v('I3 toalha de piso < nº de banheiros (menos tapete que banheiro)',x,`piso=${x.toalhaPiso} banheiros=${x.banheiros}`);
  const cap=r.capacidade*(x.segmento==='motel'?x.locacoes:(x.ocupacao/100)); if(x.toalhaBanho<Math.ceil(cap-1e-9)) v('I5 toalha de banho < ⌈hóspedes médios⌉ (referência direta, sem arredondar antes)',x,`banho=${x.toalhaBanho} hosp=${cap}`);
  if(/ 0 hóspedes/.test(x.conta)) v('I6 texto mostra 0 hóspedes',x,x.conta);
  if(/\b1 (camas|locações|trocas por dia)/.test(x.conta+x.contaCama)) v('I15 plural errado no texto',x,x.contaCama+' | '+x.conta);
  if(x.toalhaBanho!==x.toalhaRosto) v('I7 banho != rosto',x,'');
  if(x.minVale && /Vale o mínimo/.test(x.conta)===false) v('I8 mínimo vale mas texto não diz',x,x.conta);
  if(!x.minVale && /abaixo do mínimo de/.test(x.conta)) v('I9 texto fala em mínimo sem valer',x,x.conta);
  if(/NaN|undefined|Infinity/.test(x.conta+x.contaCama)) v('I10 texto com NaN/undefined',x,x.conta);
  if(x.banhoTot!==x.toalhaBanho+x.toalhaRosto+x.toalhaPiso) v('I11 total do banho não soma itens',x,'');
  if(x.total!==x.cama+x.banhoTot) v('I12 total != cama+banho',x,'');
  // cama: nunca menos que PAR por cama
  const par=E.SEG[x.segmento].par; if(x.cama<x.leitos*par*3) v('I13 cama abaixo do PAR×camas (3 peças por jogo)',x,`cama=${x.cama}`);
}
// I16: a conta impressa reproduz o número (hóspedes × troca × ciclo, como aparece no texto)
for(const x of rows){ if(x.segmento==='motel') continue;
  const m=x.conta.match(/(?:giro de |: )([\d,]+) hóspedes? por dia × ([\d,]+) troca × ([\d,]+) dias de ciclo(?: dá ([\d.]+))?/);
  if(!m) continue; const f=t=>parseFloat(t.replace(',','.'));
  const mg=x.conta.match(/Margem de (\d+)%/); const base=f(m[1])*f(m[2])*f(m[3])*(1+(mg?parseInt(mg[1],10)/100:0));
  if(m[4]){ if(Math.ceil(base-1e-9)!==parseInt(m[4].replace(/\./g,''),10)) v('I16 conta impressa não reproduz o giro',x,x.conta.slice(0,160)); }
  else if(Math.ceil(base-1e-9)!==x.toalhaBanho) v('I16 conta impressa não reproduz o número',x,`${m[0]} -> ${x.toalhaBanho}`);
}
// monotonicidade: varia uma dimensão por vez e compara
function vizinho(x,campo,lista,nome,cmp){ const i=lista.indexOf(x[campo]); if(i<0||i+1>=lista.length) return; const y=mapa.get(key({...x,[campo]:lista[i+1]})); if(!y) return; const bad=cmp(x,y); if(bad) v(nome,x,bad+` | ${campo}: ${x[campo]} -> ${lista[i+1]}`); }
let planoBanh=0, totalBanh=0, planoPiso=0;
for(const x of rows){
  vizinho(x,'leitos',LEITOS,'M1 total diminui ao subir camas',(a,b)=>b.total<a.total&&`${a.total}->${b.total}`);
  vizinho(x,'banheiros',BANH,'M2 total diminui ao subir banheiros',(a,b)=>b.total<a.total&&`${a.total}->${b.total}`);
  if(x.segmento!=='motel') vizinho(x,'ocupacao',OCUP,'M3 total diminui ao subir ocupação',(a,b)=>b.total<a.total&&`${a.total}->${b.total}`);
  if(x.segmento==='motel') vizinho(x,'locacoes',LOC,'M4 total diminui ao subir locações',(a,b)=>b.total<a.total&&`${a.total}->${b.total}`);
  const p=mapa.get(key({...x,margem:'com'})), q=mapa.get(key({...x,margem:'sem'})); if(x.margem==='com'&&q&&q.total>p.total) v('M5 sem margem maior que com margem',x,`${p.total} vs ${q.total}`);
  const t=mapa.get(key({...x,lavanderia:'terceirizada'})), i2=mapa.get(key({...x,lavanderia:'interna'})); if(x.lavanderia==='interna'&&t.total<i2.total) v('M6 terceirizada menor que própria',x,`${t.total} vs ${i2.total}`);
  if(x.segmento!=='motel'){ const o=['saida','alternada','diaria']; const ia=o.indexOf(x.trocaToalha); if(ia<2){ const y=mapa.get(key({...x,trocaToalha:o[ia+1]})); if(y&&y.banhoTot<x.banhoTot) v('M7 mais troca de toalha reduz banho',x,`${x.banhoTot}->${y.banhoTot}`);} 
    const ic=o.indexOf(x.trocaCama); if(ic<2){ const y=mapa.get(key({...x,trocaCama:o[ic+1]})); if(y&&y.cama<x.cama) v('M8 mais troca de cama reduz cama',x,`${x.cama}->${y.cama}`);} }
  // sensibilidade a banheiros
  const i=BANH.indexOf(x.banheiros); if(i+1<BANH.length){ const y=mapa.get(key({...x,banheiros:BANH[i+1]})); totalBanh++; if(y.toalhaBanho===x.toalhaBanho) planoBanh++; if(y.toalhaPiso===x.toalhaPiso) planoPiso++; }
}
console.log('\n== VIOLAÇÕES (nome: ocorrências, exemplos) ==');
for(const [k,o] of Object.entries(viol).sort()) console.log(`\n${k}: ${o.n}`), o.ex.forEach(e=>console.log('   ',JSON.stringify(e)));
if(!Object.keys(viol).length) console.log('nenhuma');
console.log(`\n== SENSIBILIDADE A BANHEIROS (passo para o próximo valor da lista) ==\ntoalha de banho/rosto não muda: ${planoBanh}/${totalBanh} (${(100*planoBanh/totalBanh).toFixed(1)}%)\ntoalha de piso não muda: ${planoPiso}/${totalBanh} (${(100*planoPiso/totalBanh).toFixed(1)}%)`);
const porSeg={}; for(const x of rows){ const s=x.segmento; porSeg[s]=porSeg[s]||{n:0,minVale:0}; porSeg[s].n++; if(x.minVale) porSeg[s].minVale++; }
console.log('\n== QUANDO O MÍNIMO POR BANHEIRO VALE (por segmento) =='); for(const [s,o] of Object.entries(porSeg)) console.log(s,`${o.minVale}/${o.n} (${(100*o.minVale/o.n).toFixed(1)}%)`);
const ci=process.argv.indexOf('--csv'); if(ci>0){ fs.writeFileSync(process.argv[ci+1],'segmento,leitos,banheiros,perfil,ocup,loc,lav,trocaCama,trocaToalha,margem,hospedes,ciclo,cama,toalhaBanho,toalhaRosto,toalhaPiso,minVale,total\n'+rows.map(x=>[x.segmento,x.leitos,x.banheiros,x.perfil,x.ocupacao,x.locacoes,x.lavanderia,x.trocaCama,x.trocaToalha,x.margem,x.hospedes,x.ciclo,x.cama,x.toalhaBanho,x.toalhaRosto,x.toalhaPiso,x.minVale,x.total].join(',')).join('\n')); }
