#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require('path');
const config = require('./configs/config.cjs');

function _run() {
    let argv = process.argv.slice();
    let command = argv[2];
    let target = argv[3];

    if (command === 'add') {
        // 添加服务器
        let newServer = { alias: target, host: argv[4], userName: argv[5], signName: argv[6] };
        config.addServer(newServer);
        console.log('服务器已添加:', newServer);
        return;
    }

    if (command === 'remove') {
        // 删除服务器
        config.removeServer(target);
        console.log('服务器已删除:', target);
        return;
    }

    if (command === 'update') {
        // 更新服务器
        let newServer = { host: argv[4], userName: argv[5], signName: argv[6] };
        config.updateServer(target, newServer);
        console.log('服务器已更新:', target);
        return;
    }

    if (command === 'list') {
        // 列出所有服务器
        console.log('当前服务器列表:', config.getServers());
        return;
    }

    if (command === 'get') {
        // 获取服务器信息
        const server = config.getServerByAlias(target);
        if (server) {
            console.log('服务器信息:', server);
        } else {
            console.error(`错误：无法获取服务器 ${target} 的信息。`);
        }
        return;
    }

    if(command === 'connect'){
        let obj = config.getServers().filter((item) => target === item.alias)?.[0];
        if (!obj) {
            console.error('错误：没有找到该服务器。');
            return;
        }
        let { alias, host, userName, signName } = obj;
        execSync(`ssh -i ${path.join(__dirname, '../libs', signName)} ${userName}@${host}`, { stdio: 'inherit' });
    }
}

_run();