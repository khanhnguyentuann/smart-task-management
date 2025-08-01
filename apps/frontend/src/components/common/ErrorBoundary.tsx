"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center space-y-4">
                        <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
                        <h1 className="text-2xl font-bold">Đã xảy ra lỗi</h1>
                        <p className="text-muted-foreground">
                            Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left text-sm bg-muted p-4 rounded-md">
                                <summary className="cursor-pointer font-medium">Chi tiết lỗi</summary>
                                <pre className="mt-2 whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-2 justify-center">
                            <Button onClick={this.handleReset}>Thử lại</Button>
                            <Button variant="outline" onClick={() => window.location.href = '/'}>
                                Về trang chủ
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}