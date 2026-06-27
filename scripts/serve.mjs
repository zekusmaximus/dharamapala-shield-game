import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const staticRoot = join(projectRoot, 'dist');
const port = Number.parseInt(process.env.PORT || '3000', 10);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml; charset=utf-8']
]);

function resolveRequestPath(requestUrl = '/') {
  const url = new URL(requestUrl, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const absolutePath = resolve(staticRoot, requestedPath);
  const relativePath = relative(staticRoot, absolutePath);

  if (
    relativePath.startsWith(`..${sep}`) ||
    relativePath === '..' ||
    relativePath.includes(`..${sep}`)
  ) {
    return null;
  }

  return absolutePath;
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method Not Allowed');
    return;
  }

  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(400);
    response.end('Bad Request');
    return;
  }

  try {
    const file = await stat(filePath);
    if (!file.isFile()) {
      throw new Error('Not a file');
    }

    response.writeHead(200, {
      'Content-Type': contentTypes.get(extname(filePath)) || 'application/octet-stream',
      'Content-Length': file.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not Found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Dharmapala Shield is available at http://localhost:${port}`);
});
