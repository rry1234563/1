const crypto = require('crypto');

// 从环境变量读取用户列表
const USERS_JSON = process.env.USERS || '[{"username":"2024080818541","password":"8541"}]';
let users = [];
try {
    users = JSON.parse(USERS_JSON);
} catch(e) {
    users = [];
}

// 生成简单的令牌（HMAC-SHA256）
function generateToken(username, secret) {
    const payload = `${username}:${Date.now()}`;
    return crypto.createHmac('sha256', secret).update(payload).digest('hex') + ':' + payload;
}

const SECRET = process.env.TOKEN_SECRET || 'default-secret-change-me';

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: '方法不允许' }) };
    }
    try {
        const { username, password } = JSON.parse(event.body);
        const user = users.find(u => u.username === username);
        if (!user) {
            return { statusCode: 401, body: JSON.stringify({ success: false, message: '账号或密码错误' }) };
        }
        if (user.password !== password) {
            return { statusCode: 401, body: JSON.stringify({ success: false, message: '账号或密码错误' }) };
        }
        const token = generateToken(username, SECRET);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, token })
        };
    } catch(e) {
        return { statusCode: 500, body: JSON.stringify({ success: false, message: '服务器错误' }) };
    }
};
