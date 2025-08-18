"use client"

import { useMemo } from "react"

interface MarkdownRendererProps {
    content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const renderedContent = useMemo(() => {
        let html = content

        // Handle mentions
        html = html.replace(/@(\w+)/g, '<span class="mention">@$1</span>')

        // Handle bold text
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

        // Handle italic text
        html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

        // Handle inline code
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

        // Handle code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre class="code-block"><code class="language-${lang || "text"}">${code.trim()}</code></pre>`
        })

        // Handle lists
        html = html.replace(/^- (.+)$/gm, "<li>$1</li>")
        html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")

        // Handle line breaks
        html = html.replace(/\n/g, "<br>")

        // Handle blockquotes
        html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")

        return html
    }, [content])

    return (
        <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
            style={
                {
                    "--mention-color": "hsl(var(--primary))",
                    "--mention-bg": "hsl(var(--primary) / 0.1)",
                    "--code-bg": "hsl(var(--muted))",
                    "--code-color": "hsl(var(--foreground))",
                    "--blockquote-border": "hsl(var(--border))",
                    "--blockquote-bg": "hsl(var(--muted) / 0.5)",
                } as React.CSSProperties
            }
        />
    )
}
