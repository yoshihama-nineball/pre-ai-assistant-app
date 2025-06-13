import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#f8b4cb', // 優しいピンク
      light: '#fcc8d8', // 薄いピンク
      dark: '#e595b3', // 深いピンク
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e6d7c3', // 温かいベージュ
      light: '#f0e8d8', // ライトベージュ
      dark: '#d4c2a3', // ダークベージュ
      contrastText: '#5a5a5a',
    },
    background: {
      default: '#fef9f6', // アイボリーに近い背景
      paper: '#ffffff',
    },
    neutral: {
      main: '#9e9e9e',
      light: '#cfcfcf',
      dark: '#707070',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#5a5a5a', // ベージュに合うダークテキスト
      secondary: '#8a7a6a', // ベージュに合う薄めのテキスト
    },
    // グラデーション用のカスタムカラー
    customGradient: {
      start: '#fef9f6', // アイボリー
      middle: '#f8e8e5', // ピンクベージュ
      end: '#f0d4d8', // 薄いピンク
    },
  },
  // グローバルなCSSの上書き
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background: linear-gradient(135deg, #fef9f6 0%, #f8e8e5 50%, #f0d4d8 100%);
          background-attachment: fixed;
        }
        
        .gradient-card {
          background: linear-gradient(135deg, #fef9f6 0%, #f8e8e5 100%);
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(232, 149, 179, 0.1);
        }
        
        .circle-button {
          background: white;
          border-radius: 50%;
          padding: 16px;
          box-shadow: 0 4px 10px rgba(248, 180, 203, 0.15);
          transition: all 0.3s ease;
        }
        
        .circle-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(248, 180, 203, 0.25);
        }

        /* ピンクのアクセントボタン */
        .pink-accent-button {
          background: linear-gradient(135deg, #f8b4cb 0%, #fcc8d8 100%);
          color: white;
          border-radius: 25px;
          padding: 12px 24px;
          box-shadow: 0 3px 8px rgba(248, 180, 203, 0.3);
          transition: all 0.3s ease;
        }
        
        .pink-accent-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 12px rgba(248, 180, 203, 0.4);
        }

        /* ベージュのサブボタン */
        .beige-button {
          background: linear-gradient(135deg, #e6d7c3 0%, #f0e8d8 100%);
          color: #5a5a5a;
          border-radius: 25px;
          padding: 12px 24px;
          box-shadow: 0 2px 6px rgba(230, 215, 195, 0.3);
          transition: all 0.3s ease;
        }
        
        .beige-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(230, 215, 195, 0.4);
        }
      `,
    },
    // ボタンのスタイル定義
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-black': {
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          },
        },
      },
      variants: [
        {
          props: { variant: 'black' },
          style: {
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          },
        },
      ],
    },
  },
  shape: {
    borderRadius: 12, // 全体的に少し丸みを持たせる
  },
  typography: {
    fontFamily:
      '"Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
    h1: {
      fontWeight: 600,
      color: '#5a5a5a', // ピンクテーマに合うテキスト色
    },
    h2: {
      fontWeight: 600,
      color: '#5a5a5a',
    },
    button: {
      fontWeight: 600,
    },
  },
})

// TypeScriptの型定義を拡張
declare module '@mui/material/styles' {
  interface Palette {
    customGradient: {
      start: string
      middle: string
      end: string
    }
  }

  interface PaletteOptions {
    customGradient?: {
      start: string
      middle: string
      end: string
    }
    neutral?: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    black: true
  }

  interface ButtonPropsColorOverrides {
    neutral: true
  }
}

export default theme
