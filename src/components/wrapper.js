import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Layout, Menu, PageHeader, Spin } from 'antd';
import {
    HomeOutlined,
    DatabaseOutlined,
    CarOutlined,
    OrderedListOutlined,
    SettingOutlined,
    LoadingOutlined,
    PictureOutlined,
    BuildOutlined,
} from '@ant-design/icons';

import styles from './wrapper.module.scss';

export default function Wrapper({ title, extra, loading, onBack, children }) {
    const [collapsed, setCollapsed] = useState(true);
    const location = useLocation();

    return (
        <>
            <Helmet>
                <title>{title} - Admin</title>
            </Helmet>

            <Layout hasSider style={{ minHeight: '100vh' }}>
                <Layout.Sider
                    className={styles.layoutSider}
                    width="200"
                    collapsible
                    collapsed={collapsed}
                    collapsedWidth="80"
                    onCollapse={collapsed => setCollapsed(collapsed)}
                >
                    <div className={styles.logo}/>

                    <Menu theme="dark" mode="vertical" selectedKeys={[location.pathname]}>
                        <Menu.Item key="/admin">
                            <Link to="/admin">
                                <HomeOutlined/>
                                <span className="nav-text">Home</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/brands">
                            <Link to="/admin/brands">
                                <DatabaseOutlined/>
                                <span className="nav-text">Brands</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/models">
                            <Link to="/admin/models">
                                <CarOutlined/>
                                <span className="nav-text">Models</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/galleries">
                            <Link to="/admin/galleries">
                                <PictureOutlined/>
                                <span className="nav-text">Gallery</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/specs">
                            <Link to="/admin/specs">
                                <BuildOutlined/>
                                <span className="nav-text">Specs</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/ratings">
                            <Link to="/admin/ratings">
                                <OrderedListOutlined/>
                                <span className="nav-text">Ratings</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/settings">
                            <Link to="/admin/settings">
                                <SettingOutlined/>
                                <span className="nav-text">Settings</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>

                <Layout className={styles.layoutBody} style={{ marginLeft: collapsed ? 80 : 200 }}>
                    <Spin
                        spinning={loading === undefined ? false : loading}
                        indicator={<LoadingOutlined spin/>}
                        size="large"
                        delay={250}
                    >
                        {title && (
                            <Layout.Header
                                className={styles.layoutHeader}
                                style={{
                                    left: collapsed ? 80 : 200,
                                    paddingRight: collapsed ? 80 : 200,
                                }}
                            >
                                <PageHeader title={title} extra={extra} onBack={onBack}/>
                            </Layout.Header>
                        )}
                        <Layout.Content>
                            <div className={styles.layoutContent}>{children}</div>
                        </Layout.Content>
                        <Layout.Footer className={styles.layoutFooter}>
                            CarsRate © 2020 Created by KIRINAMI
                        </Layout.Footer>
                    </Spin>
                </Layout>
            </Layout>
        </>
    );
}
