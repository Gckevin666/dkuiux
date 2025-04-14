// 简单的Node.js本地服务器
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.php': 'text/html' // 简单处理PHP文件，实际不执行PHP代码
};

const server = http.createServer((req, res) => {
    console.log(`请求: ${req.url}`);
    
    // 处理根目录请求
    let filePath = req.url === '/' ? './index.html' : '.' + req.url;
    
    // 处理URL中的查询参数
    if (filePath.includes('?')) {
        filePath = filePath.split('?')[0];
    }
    
    // 获取文件扩展名
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // 读取文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // 文件不存在
            if (err.code === 'ENOENT') {
                console.log(`文件不存在: ${filePath}`);
                res.writeHead(404);
                res.end('404 - 文件不存在');
            } else {
                // 服务器错误
                console.log(`服务器错误: ${err.code}`);
                res.writeHead(500);
                res.end(`服务器错误: ${err.code}`);
            }
        } else {
            // 成功返回文件内容
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}/`);
    console.log(`管理后台: http://localhost:${PORT}/admin/index.html`);
}); 