/**
 * API 客户端 - 对接后端服务
 */
const API_BASE = '';

const API = {
    async get(url) {
        const res = await fetch(API_BASE + url);
        return res.json();
    },

    async post(url, data) {
        const res = await fetch(API_BASE + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async postForm(url, formData) {
        const res = await fetch(API_BASE + url, {
            method: 'POST',
            body: formData
        });
        return res.json();
    }
};
