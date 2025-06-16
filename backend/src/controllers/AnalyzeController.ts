import type { Request, Response } from 'express'

export class AnalyzeController {
  static getAnalyzer = async (req: Request, res: Response) => {
    // const { prompt } = req.body

    // try {
    //   const response = await axios.post(
    //     'https://api.openai.com/v1/chat/completions',
    //     {
    //       model: 'gpt-4o-mini',
    //       messages: [
    //         {
    //           role: 'system',
    //           content: 'あなたは心理カウンセラーです。今から話す相談に乗ってね',
    //         },
    //         {
    //           role: 'user',
    //           content: `${prompt}`,
    //         },
    //       ],
    //       max_tokens: 200,
    //       n: 3,
    //       stop: null,
    //       temperature: 0.7,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //       },
    //     }
    //   )

    //   const adviseSentences = response.data.choices.map((choice) =>
    //     choice.message.content.trim()
    //   )
    //   res.json({ adviseSentences })
    res.json({
      message: 'アナライズAPI成功',
    })
    // } catch (error) {
    //   console.error('Error processing sentence:', error)
    //   res.status(500).json({ error: 'Error processing sentence' })
    // }
  }
}