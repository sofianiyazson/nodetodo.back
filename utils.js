
const utils = {
    getUniqueId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    getReqData: req => {
        return new Promise((resolve, reject) => {
            try {
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk.toString();
                });
                req.on("end", () => {
                    resolve(body);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = utils;