import type { Request, Response } from 'express'
import axios from 'axios'

// セッションの型定義を拡張
declare module 'express-session' {
  interface SessionData {
    consultations: Array<{
      prompt: string
      response: string
      moodyLevel: number
      timestamp: Date
    }>
  }
}

export class AnalyzeController {
  static getAnalyzer = async (req: Request, res: Response) => {
    const { prompt, moodyLevel } = req.body

    try {
      // セッションから過去の相談履歴を取得
      const pastConsultations = req.session.consultations || []

      // 過去の傾向を分析
      const personalizedContext = generatePersonalizedContext(pastConsultations)

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `あなたは視点を変えるのが得意な、心優しいゴリラのリフレーミングコーチです。

語尾に「ウホ」「ウホね」「ウホよ」などを自然な形で文末に付けて、ため口でお茶目に回答してください。

【あなたの役割】
相談者の気持ちを否定せず、「別の見方の可能性」を複数の選択肢として提示します。
押し付けず、選んでもらう形で提案します。

【絶対に守ること】
- 相談者の感情を否定しない（「でも」で始めない）
- 加害者や相手を擁護しない
- 断定せず、「〜かもしれない」「〜という見方もある」など柔らかく
- 最後に「どう捉えるかはあなた次第」と選択権を返す

【アドバイス構成】
1. 気持ちをしっかり受け止める（2文）
   例：「○○って感じるのは辛いウホね。その気持ちはとても自然ウホ。」

2. 「別の見方」を2-3個、選択肢として提示（箇条書き可）
   - 必ず「こういう見方もあるウホ：」などの前置き
   - 各視点は「〜かもしれない」「〜とも言える」など柔らかく
   - 加害者擁護は絶対にしない

3. 締めくくり（1-2文）
   「でも、どう考えるかはあなた次第ウホ。今は辛くて当然ウホし、無理に前向きにならなくていいウホよ。」

【文字数】250-300文字程度、必ず完結させる

${personalizedContext ? `\n【この方の過去の傾向】\n${personalizedContext}\n` : ''}`,
            },
            {
              role: 'user',
              content: `以下の出来事でモヤモヤしています。別の見方を教えてください：\n\n${prompt}\n\nモヤモヤレベル: ${moodyLevel || '不明'}/10`,
            },
          ],
          max_tokens: 500,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      )

      const adviseSentences = response.data.choices[0].message.content.trim()

      // セッションに相談履歴を保存
      const consultation = {
        prompt,
        response: adviseSentences,
        moodyLevel: moodyLevel || null,
        timestamp: new Date(),
      }

      // セッションを初期化（初回の場合）
      if (!req.session.consultations) {
        req.session.consultations = []
      }

      // 新しい相談を追加（最大5件まで保持）
      req.session.consultations.push(consultation)
      if (req.session.consultations.length > 5) {
        req.session.consultations.shift() // 古いものを削除
      }

      res.json({
        adviseSentences,
        sessionInfo: {
          totalConsultations: req.session.consultations.length,
          hasHistory: req.session.consultations.length > 1,
        },
      })
    } catch (error: any) {
      console.log('Full error object:', error.response?.data)
      console.log('Error status:', error.response?.status)
      console.log('Error message:', error.message)
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded')
        res.status(429).json({
          error:
            'API呼び出し制限に達しました。しばらく待ってから再試行してください。',
        })
      } else {
        console.error('Error:', error.response?.data || error.message)
        res.status(500).json({ error: 'API呼び出しでエラーが発生しました' })
      }
    }
  }
}

// 過去の傾向から個別化コンテキストを生成
function generatePersonalizedContext(consultations: any[]): string {
  if (consultations.length === 0) return ''

  const recentConsultations = consultations.slice(-3) // 最新3件

  const moodyLevels = recentConsultations
    .map((c) => c.moodyLevel)
    .filter((level) => level !== null && level !== undefined)

  let context = `過去${consultations.length}回の相談履歴があります。`

  if (moodyLevels.length > 0) {
    const avgLevel = (
      moodyLevels.reduce((a, b) => a + b, 0) / moodyLevels.length
    ).toFixed(1)
    const trend =
      moodyLevels.length >= 2
        ? moodyLevels[moodyLevels.length - 1] < moodyLevels[0]
          ? '改善傾向'
          : '注意が必要'
        : ''

    context += `\n- 最近の平均モヤモヤレベル: ${avgLevel}/10`
    if (trend) context += ` (${trend})`
  }

  // 最新の相談からのパターン分析
  const commonWords = extractCommonWords(
    recentConsultations.map((c) => c.prompt)
  )
  if (commonWords.length > 0) {
    context += `\n- よく出てくるキーワード: ${commonWords.join(', ')}`
  }

  return context
}

// よく出てくる単語を抽出
function extractCommonWords(prompts: string[]): string[] {
  const allText = prompts.join(' ')
  const words = allText.match(/[ぁ-んァ-ヶー一-龠]+/g) || []
  const frequency: { [key: string]: number } = {}

  words.forEach((word) => {
    if (word.length >= 2) {
      // 2文字以上の単語のみ
      frequency[word] = (frequency[word] || 0) + 1
    }
  })

  return Object.entries(frequency)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word)
}
