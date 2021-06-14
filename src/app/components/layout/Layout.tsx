import React from 'react';
import { Route } from 'react-router-dom';

interface LayoutProps {
    component: React.ComponentType<any>;
    path: string;
    exact: boolean;
}

export default function Layout({ component: Component, ...rest }: LayoutProps) {
    return (
        <Route
            {...rest}
            render={props => (
                <div className="layout">
                    <div className="decor decor--top-left" />
                    <div className="decor decor--bot-right" />
                    <Component {...props} />
                </div>
            )}
        />
    );
}
