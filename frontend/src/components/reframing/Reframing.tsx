'use client'
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Alert,
  Slider,
  FormControl,
  FormLabel,
} from '@mui/material'
import React, { useState } from 'react'

const Reframing = () => {
  const [prompt, setPrompt] = useState('')
  const [moodyLevel, setMoodyLevel] = useState(5)
  const [advice, setAdvice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionInfo, setSessionInfo] = useState<{
    totalConsultations: number
    hasHistory: boolean
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError('')
    setAdvice('')

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // セッション管理のため
        body: JSON.stringify({
          prompt: prompt,
          moodyLevel: moodyLevel,
        }),
      })

      if (!response.ok) {
        throw new Error('APIエラーが発生しました')
      }

      const data = await response.json()
      setAdvice(data.adviseSentences)
      setSessionInfo(data.sessionInfo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPrompt('')
    setMoodyLevel(5)
    setAdvice('')
    setError('')
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🦍 Dr.ゴリのリフレーミング相談室「みかた」
      </Typography>
      <Typography variant="h6" component="h6" gutterBottom align="center">
        ものごとの「見かた」を変えることのできるあなたの「味方」です
      </Typography>

      {sessionInfo && (
        <Alert severity="info" sx={{ mb: 3 }}>
          相談回数: {sessionInfo.totalConsultations}回目
          {sessionInfo.hasHistory &&
            ' | 過去の相談履歴を考慮してアドバイスします'}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            今日のモヤモヤについて教えてください
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="何があったか詳しく教えてください"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例：上司に意見を無視されて、他の人がその意見を言ったときに評価された..."
            sx={{ mb: 3 }}
            disabled={loading}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel component="legend">
              モヤモヤレベル (1: 軽微 〜 10: 激怒)
            </FormLabel>
            <Box sx={{ px: 2 }}>
              <Slider
                value={moodyLevel}
                onChange={(_, newValue) => setMoodyLevel(newValue as number)}
                aria-labelledby="moody-level-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                disabled={loading}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              現在のレベル: {moodyLevel}
            </Typography>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !prompt.trim()}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  分析中ウホ...
                </>
              ) : (
                'アドバイスをもらう'
              )}
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
            >
              リセット
            </Button>
          </Box>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {advice && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h6" gutterBottom color="primary">
            Dr.ゴリからのアドバイス
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap', // 改行と自動折り返しを両方対応
              wordBreak: 'break-word', // 長い単語も適切に折り返し
              overflowWrap: 'break-word',
              width: '100%',
            }}
          >
            {advice}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default Reframing
