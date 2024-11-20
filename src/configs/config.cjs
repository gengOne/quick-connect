const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');

const filePath = path.join(__dirname, '../', 'servers', 'servers.json');

function readServers() {
    if (!fs.existsSync(filePath)) {
        console.log('不存在');
        return [];
    }
    const data = fs.readFileSync(filePath);
    return (JSON.parse(data))?.serveList || [];
}

function writeServers(serveList) {
    fsExtra.ensureFileSync(filePath)
    fs.writeFileSync(filePath, JSON.stringify({ serveList }, null, 2));
}

function serverExists(alias) {
    const serveList = readServers();
    return serveList.some(item => item.alias === alias);
}

function addServer(server) {
    const serveList = readServers();
    // 检查服务器是否已存在
    if (!serverExists(server.alias)) {
        serveList.push(server);
        writeServers(serveList);
    } else {
        console.error(`服务器 ${server.alias} 已存在，无法添加。`);
    }
}

function removeServer(alias) {
    let serveList = readServers();
    // 检查服务器是否存在
    if (serverExists(alias)) {
        serveList = serveList.filter(item => item.alias !== alias);
        writeServers(serveList);
    } else {
        console.error(`服务器 ${alias} 不存在，无法删除。`);
    }
}

function updateServer(alias, newServer) {
    let serveList = readServers();
    // 检查服务器是否存在
    if (serverExists(alias)) {
        const index = serveList.findIndex(item => item.alias === alias);
        serveList[index] = { ...serveList[index], ...newServer };
        writeServers(serveList);
    } else {
        console.error(`服务器 ${alias} 不存在，无法更新。`);
    }
}

function getServerByAlias(alias) {
    const serveList = readServers();
    const server = serveList.find(item => item.alias === alias);
    if (!server) {
        console.error(`服务器 ${alias} 不存在。`);
    }
    return server || null;
}

function getServers() {
    return readServers();
}


module.exports = {
    addServer,
    removeServer,
    updateServer,
    getServers,
    getServerByAlias
};