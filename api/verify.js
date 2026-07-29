const crypto = require('crypto');
const SECRET = process.env.TOKEN_SECRET || 'default-secret-change-me';

function verifyToken(token, username) {
    const parts = token.split(':');
    if (parts.length < 2) return false;
    const payload = parts.slice(1).join(':'); // 重构payload
    const expectedToken = crypto.createHmac('sha256', SECRET).update(payload).digest('hex') + ':' + payload;
    if (token !== expectedToken) return false;
    // 可选：检查过期，这里简单忽略
    return payload.startsWith(username + ':');
}

exports.handler = async (event) => {
    const token = event.queryStringParameters?.token;
    if (!token) {
        return { statusCode: 400, body: JSON.stringify({ valid: false }) };
    }
    // 需要用户名，但我们可以在token中包含用户名，这里要求前端也传username参数
    const username = event.queryStringParameters?.username || '';
    const valid = verifyToken(token, username);
    return {
        statusCode: 200,
        body: JSON.stringify({ valid })
    };
};
