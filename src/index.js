import 'antd/dist/antd.css';

import './index.scss';

import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import { Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './common/patches/axios';
import './common/patches/moment';

import routes from './routes';
import store from './store';

import { unregister } from './worker';

render(
    <Alert.ErrorBoundary>
        <Provider store={store}>
            <BrowserRouter>
                <Suspense
                    fallback={(
                        <Spin
                            indicator={<LoadingOutlined spin/>}
                            size="large"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                margin: '-17px 16px',
                            }}
                        />
                    )}
                >
                    {renderRoutes(routes)}
                </Suspense>
            </BrowserRouter>
        </Provider>
    </Alert.ErrorBoundary>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
