import { writeFile } from 'node:fs/promises';
const pages = await fetch('http://localhost:9335/json/list').then(r => r.json());
const ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, {once:true}));
let id = 0; const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if(pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params={}) => new Promise(r => { const n = ++id; pending.set(n,r); ws.send(JSON.stringify({id:n,method,params})); });
await send('Page.enable');
for (const width of [1440,390]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===390});
  await send('Page.navigate',{url:'http://localhost:3000/'});
  await new Promise(r=>setTimeout(r,3000));
  await send('Runtime.evaluate',{expression:'document.fonts.ready',awaitPromise:true});
  const info = await send('Runtime.evaluate',{expression:`JSON.stringify({width:innerWidth,body:document.body.scrollWidth,h1:document.querySelectorAll('h1').length,showcase:document.querySelector('section[aria-label="Vozon voice agents on phone and web"]').getBoundingClientRect().toJSON(),logos:document.querySelector('.home-design-four__logos').getBoundingClientRect().toJSON()})`,returnByValue:true});
  console.log(info.result.value);
  const shot = await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  await writeFile('C:/Windows/Temp/vozon-new-hero-'+width+'.png',Buffer.from(shot.data,'base64'));
  const bounds = JSON.parse(info.result.value).showcase;
  const detail = await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height,scale:1}});
  await writeFile('C:/Windows/Temp/vozon-tagline-'+width+'.png',Buffer.from(detail.data,'base64'));
}
ws.close();
