import { ClientThemeProvider } from '@/components/layouts/ClientThemeProvider'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactNode } from 'react'
import Button from './Button'

interface MockButtonProps {
  children: ReactNode
  href: string
  passHref?: boolean
}

// Next.js Link のモック
jest.mock('next/link', () => {
  const MockLink = ({ children, href, passHref }: MockButtonProps) => {
    return (
      <a
        href={href}
        data-testid="next-link"
        data-passhref={passHref?.toString()}
      >
        {children}
      </a>
    )
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

// テストヘルパー関数
const renderWithTheme = (component: ReactNode) => {
  return render(<ClientThemeProvider>{component}</ClientThemeProvider>)
}

describe('ボタンコンポーネントのテストケース', () => {
  it('Linkコンポーネントのhrefで正しい遷移先が設定されているか', () => {
    renderWithTheme(<Button href="/test-url">Click me</Button>)

    const linkElement = screen.getByTestId('next-link')
    expect(linkElement).toHaveAttribute('href', '/test-url')
  })

  it('子要素を正しく取得できるかのテストケース', () => {
    renderWithTheme(<Button data-testid="typography-test-id">Click me</Button>)
    const typography = screen.getByTestId('typography-test-id')
    expect(typography).toBeInTheDocument()
    expect(typography).toHaveTextContent('Click me')
  })

  it('クリックイベントが正しく動作するかのテストケース', async () => {
    const handleClick = jest.fn()
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button', { name: /click me/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('正しいvariantを適用する', () => {
    renderWithTheme(<Button variant="primary">Primary Button</Button>)
    const button = screen.getByRole('button', { name: /primary button/i })
    expect(button).toBeInTheDocument()
  })

  it('loadingの時は"Loading..."が表示される', () => {
    renderWithTheme(<Button loading>Click me</Button>)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('disabledの時はボタンが無効化される', () => {
    renderWithTheme(<Button disabled>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeDisabled()
  })
})
