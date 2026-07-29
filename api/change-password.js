// 注意：由于环境变量无法通过函数直接修改，此函数目前只能返回提示
// 实际生产中应使用数据库或外部存储。这里作为占位，返回成功提示，但密码不会实际更新。
// 管理员可通过更新Netlify环境变量 USERS 来手动修改密码。
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: '方法不允许' }) };
    }
    try {
        const { username, oldPassword, newPassword } = JSON.parse(event.body);
        // 这里只是演示，不实际修改环境变量
        // 可以记录日志或发送通知给管理员
        console.log(`用户 ${username} 请求修改密码，旧密码: ${oldPassword}, 新密码: ${newPassword}`);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: '密码修改请求已记录，管理员将为您处理' })
        };
    } catch(e) {
        return { statusCode: 500, body: JSON.stringify({ success: false, message: '服务器错误' }) };
    }
};
