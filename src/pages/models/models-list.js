import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Button, Table, Tag } from 'antd';
import { PlusOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';

import * as qs from '../../common/utils/qs';
import Wrapper from '../../components/wrapper';
import { fetchModels } from '../../slices/models-slice';

export default function ModelsList() {
    const location = useLocation();
    const history = useHistory();
    const isLoading = useSelector(state => state.models.isLoading);
    const brands = useSelector(state => state.models.brands);
    const models = useSelector(state => state.models.models);
    const total = useSelector(state => state.models.total);
    const dispatch = useDispatch();

    const query = qs.parse(location.search);
    const page = +query.page || 1;
    const size = +query.size || 10;
    const filters = query.filters || '';
    const objectFilters = qs.parseSub(filters);

    useEffect(
        () => {
            dispatch(fetchModels(page, size, filters));
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
            title="Models"
            extra={[
                <Button
                    key="new"
                    type="primary"
                    icon={<PlusOutlined/>}
                    style={{ margin: 0 }}
                    onClick={() => history.push('/admin/models/new')}
                >
                    Create
                </Button>,
            ]}
            loading={isLoading}
        >
            <Table
                rowKey="id"
                dataSource={models}
                columns={[
                    {
                        title: 'Id',
                        dataIndex: 'id',
                        width: 70,
                    },
                    {
                        title: 'Brand',
                        dataIndex: ['brand', 'title'],
                        width: 240,
                        filters: brands.map(brand => ({
                            value: brand.title,
                            text: brand.title,
                        })),
                        filteredValue: (objectFilters.brand && objectFilters.brand.title) || null,
                        filterDropdown: ({ filters, setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                            <div>
                                <Select
                                    mode="multiple"
                                    placeholder="Select brands"
                                    value={selectedKeys}
                                    style={{ display: 'block', width: 250, padding: 12 }}
                                    onChange={value => setSelectedKeys(value || [])}
                                >
                                    {filters.map(filter => (
                                        <Select.Option key={filter.value}>{filter.text}</Select.Option>
                                    ))}
                                </Select>

                                <div className="ant-table-filter-dropdown-btns">
                                    <Button
                                        type="link"
                                        size="small"
                                        disabled={!selectedKeys.length}
                                        onClick={() => clearFilters()}
                                    >
                                        Reset
                                    </Button>
                                    <Button type="primary" size="small" onClick={() => confirm()}>OK</Button>
                                </div>
                            </div>
                        ),
                    },
                    {
                        title: 'Model',
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
                                onClick={() => history.push(`/admin/models/${record.id}`)}
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
                    showTotal: total => `Total ${total} models`,
                    style: { marginBottom: 0 },
                }}
                onChange={handleFilterChange}
            />
        </Wrapper>
    );
}
