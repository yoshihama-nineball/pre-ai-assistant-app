// src/controllers/AnalyzeController.ts
import type { Request, Response } from 'express'
import axios from 'axios'

// セッションの型定義を拡張
declare module 'express-session' {
  interface SessionData {
    consultations: Array<{
      prompt: string
      response: string
      angerLevel: number
      timestamp: Date
    }>
  }
}

export class AnalyzeController {
  static getAnalyzer = async (req: Request, res: Response) => {
    const { prompt } = req.body

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
              content: `あなたは経験豊富で共感的な心理カウンセラーです。アンガーログを分析して、以下の点を重視したアドバイスをしてください：

1. まず相手の感情や努力を認めて共感する
2. 具体的で実践的なアドバイスを提供する
3. 相手の強みや良い点を見つけて褒める
4. 判断的にならず、温かく寄り添う口調で話す
5. 短期的な対処法と長期的な改善策の両方を提案する

${personalizedContext ? `\n【この方の過去の傾向】\n${personalizedContext}\n上記を踏まえて、より個別化されたアドバイスをしてください。前回からの改善点があれば褒めてください。` : ''}

返答は親しみやすく、まるで信頼できる友人のカウンセラーが話しているような温かい口調で書いてください。`,
            },
            {
              role: 'user',
              content: `以下は私のアンガーログです。分析とアドバイスをお願いします：\n\n${prompt}`,
            },
          ],
          max_tokens: 300,
          n: 1,
          stop: null,
          temperature: 0.9,
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
      const angerLevel = extractAngerLevel(prompt)
      const consultation = {
        prompt,
        response: adviseSentences,
        angerLevel,
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

  const angerLevels = recentConsultations
    .map((c) => c.angerLevel)
    .filter((level) => level !== null && level !== undefined)

  let context = `過去${consultations.length}回の相談履歴があります。`

  if (angerLevels.length > 0) {
    const avgLevel = (
      angerLevels.reduce((a, b) => a + b, 0) / angerLevels.length
    ).toFixed(1)
    const trend =
      angerLevels.length >= 2
        ? angerLevels[angerLevels.length - 1] < angerLevels[0]
          ? '改善傾向'
          : '注意が必要'
        : ''

    context += `\n- 最近の平均怒りレベル: ${avgLevel}/10`
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

// アンガーレベルを抽出
function extractAngerLevel(prompt: string): number | null {
  const match = prompt.match(/怒りレベル[:\s]*(\d+)/i)
  return match ? parseInt(match[1]) : null
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
    .filter(([_, count]) => count >= 2)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)
    .map(([word, _]) => word)
}
