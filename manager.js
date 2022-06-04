const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, 'data.json');
const utils = require('./utils');

const Manager = {
    getAll: async () => {
        return new Promise((resolve, reject) => {
            fs.readFile(dataFilePath, 'utf8', (err, data) => {
                if (!err) {
                    data = JSON.parse(data);
                    resolve(data);
                }
            });
        });
    },
    getById: async id => {
        let list = await Manager.getAll();
        let todo = list.find(k => k.id === id);
        return todo;
    },
    create: async todo => {
        return new Promise(async (resolve, reject) => {
            let list = await Manager.getAll();
            let t = {
                id: utils.getUniqueId(),
                title: todo.title,
                description: todo.description
            };
            list.push(t);
            fs.writeFile(dataFilePath, JSON.stringify(list), 'utf8', err => {
                if (!err) {
                    resolve(t);
                }
            });
        });
    },
    update: async todo => {
        return new Promise(async (resolve, reject) => {
            let list = await Manager.getAll();
            let idx = list.findIndex(k => k.id === todo.id);
            if (idx === -1) return null;

            let t = {
                ...list[idx],
                title: todo.title,
                description: todo.description
            };

            list[idx] = t;
            fs.writeFile(dataFilePath, JSON.stringify(list), 'utf8', err => {
                if (!err) {
                    resolve(todo);
                }
            });
        });
    },
    delete: async id => {
        return new Promise(async (resolve, reject) => {
            let list = await Manager.getAll();
            list = list.filter(k => k.id !== id);
            fs.writeFile(dataFilePath, JSON.stringify(list), 'utf8', err => {
                if (!err) {
                    resolve();
                }
            });
        });
    },
};

module.exports = Manager;