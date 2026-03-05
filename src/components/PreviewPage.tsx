import { css, Style } from "hono/css";

interface PreviewPageProps {
  title: string;
  widgetHtml: string;
}

const PreviewPage = ({ title, widgetHtml }: PreviewPageProps) => (
  <html>
    <head>
      <title>{`Preview - ${title}`}</title>
      <Style />
      <style>{`
        :root {
          --color-primary: #e2e8f0;
          --color-secondary: #8a919c;
          --color-widget-background: #1a1c24;
          --color-background: #11131a;
          --color-text-highlight: #fff;
          --color-text-subdue: #64748b;
          --font-size-h1: 1.6rem;
          --font-size-h2: 1.3rem;
          --font-size-h3: 0.95rem;
          --font-size-h4: 0.85rem;
          --font-size-h5: 0.75rem;
          --font-size-h6: 0.7rem;
          --font-size-base: 0.85rem;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: var(--color-background);
          margin: 0;
          color: var(--color-primary);
        }
        a { text-decoration: none; }
        a:hover { text-decoration: underline; }
        ul { list-style: none; margin: 0; padding: 0; }
      `}</style>
    </head>
    <body>
      <div class={previewPage}>
        <div class={previewWidget}>
          <h2 class={previewWidgetTitle}>{title}</h2>
          <div dangerouslySetInnerHTML={{ __html: widgetHtml }} />
        </div>
      </div>
    </body>
  </html>
)

export default PreviewPage

const previewPage = css`
  min-height: 100vh;
  background: var(--color-widget-background);
  display: flex;
  justify-content: center;
  padding: 2rem;
`

const previewWidget = css`
  width: 100%;
  max-width: 500px;
`

const previewWidgetTitle = css`
  font-size: var(--font-size-h2);
  color: var(--color-primary);
  margin: 0 0 1rem 0;
  font-weight: bold;
`
