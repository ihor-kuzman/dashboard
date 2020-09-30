/* eslint-disable */

import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Tag } from 'antd';
import { PlusOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';

import * as qs from '../../common/utils/qs';
import Wrapper from '../../components/wrapper';
import { fetchSpecs } from '../../slices/specs-slice';

export default function SpecsList() {
    const location = useLocation();
    const history = useHistory();
    const isLoading = useSelector(state => state.specs.isLoading);
    const specs = useSelector(state => state.specs.specs);
    const total = useSelector(state => state.specs.total);
    const dispatch = useDispatch();

    const query = qs.parse(location.search);
    const page = +query.page || 1;
    const size = +query.size || 10;
    const filters = query.filters || '';
    const objectFilters = qs.parseSub(filters);

    useEffect(
        () => {
            dispatch(fetchSpecs(page, size, filters));
        },
        [dispatch, page, size, filters],
    );

    function handleFilterChange(pagination, filters) {
        history.push({
            search: qs.stringify({
                page: pagination.current,
                size: pagination.pageSize,
                filters: qs.stringifySub(filters) || null,
            }),
        });
    }

    return (
        <Wrapper
            title="Specs"
            extra={[
                <Button
                    key="new"
                    type="primary"
                    icon={<PlusOutlined/>}
                    style={{ margin: 0 }}
                    onClick={() => history.push('/admin/specs/new')}
                >
                    Create
                </Button>,
            ]}
        >
            <Table
                rowKey="id"
                dataSource={specs}
                columns={[
                    {
                        title: 'Id',
                        dataIndex: 'id',
                        width: 70,
                    },
                    {
                        title: 'Model',
                        dataIndex: ['model', 'title'],
                        width: 180,
                        ellipsis: true,
                    },
                    {
                        title: 'Title',
                        dataIndex: 'title',
                        ellipsis: true,
                    },
                    {
                        title: 'Status',
                        dataIndex: 'status',
                        width: 120,
                        filters: [
                            { text: 'processing', value: 'processing' },
                            { text: 'published', value: 'published' },
                        ],
                        filteredValue: objectFilters.status || null,
                        render: status => (
                            <Tag
                                color={status === 'published' ? 'success' : status}
                                style={{ width: '100%', height: 32, padding: '4px 7px', textAlign: 'center' }}
                            >
                                {status}
                            </Tag>
                        ),
                    },
                    {
                        title: 'Action',
                        dataIndex: 'action',
                        width: 110,
                        render: (text, record) => (
                            <Button
                                type="primary"
                                icon={<EditOutlined/>}
                                onClick={() => history.push(`/admin/specs/${record.id}`)}
                            >
                                Edit
                            </Button>
                        ),
                    },
                ]}
                loading={{
                    spinning: isLoading,
                    indicator: <LoadingOutlined spin/>,
                }}
                pagination={{
                    total,
                    current: page,
                    pageSize: size,
                    showSizeChanger: true,
                    showTotal: total => `Total ${total} specs`,
                    style: { marginBottom: 0 },
                }}
                onChange={handleFilterChange}
            />
        </Wrapper>
    );
}
