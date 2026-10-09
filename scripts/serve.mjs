import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const {basePath}=JSON.parse(fs.readFileSync(path.join(dist,'build-info.json'),'utf8'));
const port=Number(process.env.PORT||8765);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.md':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(basePath!=='/'&&pathname===basePath.slice(0,-1)){res.writeHead(302,{Location:basePath});res.end();return;}
  if(!pathname.startsWith(basePath)){res.writeHead(404);res.end('Not found');return;}
  let file=path.resolve(dist,pathname.slice(basePath.length));
  if(file!==path.resolve(dist)&&!file.startsWith(path.resolve(dist)+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404,{'Content-Type':mime['.html']});res.end(fs.readFileSync(path.join(dist,'404.html')));return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}${basePath}`));
