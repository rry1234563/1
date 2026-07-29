// api/search.js
export default async function handler(req, res) {
    const q = req.query.q;
    if (!q) {
        return res.status(400).json({ error: '缺少问题参数' });
    }

    try {
        const response = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`
        );
        const data = await response.json();

        let answer = '';
        if (data.Abstract && data.Abstract.trim() !== '') {
            answer = data.Abstract + '\n\n';
            if (data.AbstractURL) answer += `来源：${data.AbstractURL}`;
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            const snippets = data.RelatedTopics.slice(0, 3).map((t, i) => {
                const text = typeof t === 'string' ? t : t.Text;
                const url = t.FirstURL || '';
                return `${i + 1}. ${text}${url ? ' (' + url + ')' : ''}`;
            }).join('\n');
            answer = `有关“${q}”的搜索结果：\n${snippets}\n\n以上信息仅供参考。`;
        } else {
            answer = '没有找到相关信息，请换个问题试试。';
        }

        return res.json({ answer });
    } catch (err) {
        console.error('搜索失败:', err);
        return res.status(500).json({ answer: '搜索服务暂时不可用。' });
    }
}
