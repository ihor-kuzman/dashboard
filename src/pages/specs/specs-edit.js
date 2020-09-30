import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { message, Form, Select, Input, Button, Menu, Dropdown, Divider, Modal, Alert, Row, Col, Table } from 'antd';
import { SaveOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import Wrapper from '../../components/wrapper';
import TextEditor from '../../components/text-editor';
import { fetchSpec, saveSpec, removeSpec } from '../../slices/specs-slice';

function transformSlug(value) {
    return value.toLowerCase().replace(/[\W_]+/g, '-');
}

export default function SpecsEdit() {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.specs.isLoading);
    const models = useSelector(state => state.specs.models) || [];
    const spec = useSelector(state => state.specs.specs.find(spec => spec.id === +params.id)) || {};
    const errors = useSelector(state => state.specs.errors);

    const [formState, setFormState] = useState({
        isSlugTouched: false,
    });
    const [form] = Form.useForm();

    useEffect(
        () => {
            dispatch(fetchSpec(params.id));
        },
        [dispatch, params.id],
    );

    useEffect(
        () => {
            form.resetFields();
        },
        [form, spec.id],
    );

    async function handleRemove() {
        message.loading({
            key: 'remove',
            content: 'Spec removing...',
        });

        await dispatch(removeSpec(params.id));

        history.replace('/admin/specs');

        message.success({
            key: 'remove',
            content: 'Spec successfully removed',
        });
    }

    async function handleSave(key) {
        if (key === 'save-and-publish') {
            form.setFieldsValue({
                status: 'published',
            });
        }
        form.submit();
    }

    async function handleSubmit(specData) {
        message.loading({
            key: 'save',
            content: 'Spec saving...',
        });

        const specId = await dispatch(saveSpec(params.id, {
            ...specData,
            keywords: specData.keywords.join(','),
        }));
        if (!specId) {
            message.error({
                key: 'save',
                content: 'Errors occurred while spec saving!',
            });
            return;
        }

        if (params.id === 'new') {
            history.replace(`/admin/specs/${specId}`);
        } else {
            form.resetFields();
        }

        message.success({
            key: 'save',
            content: 'Spec successfully saved!',
        });
    }

    return (
        <Wrapper
            title={`${params.id === 'new' ? 'New' : 'Edit'}${spec && spec.title ? ` "${spec.title}" ` : ' '}spec`}
            extra={[
                <Button
                    key="remove"
                    type="danger"
                    icon={<DeleteOutlined/>}
                    onClick={() => {
                        Modal.confirm({
                            title: 'Are you sure delete this spec?',
                            icon: <ExclamationCircleOutlined/>,
                            okType: 'danger',
                            okText: 'Yes',
                            cancelText: 'No',
                            onOk() {
                                handleRemove();
                            },
                        });
                    }}
                />,
                <Divider key="divider" type="vertical"/>,
                <Dropdown.Button
                    key="save"
                    type="primary"
                    icon={(<DownOutlined/>)}
                    overlay={(
                        <Menu onClick={({ key }) => handleSave(key)}>
                            <Menu.Item key="save-and-publish">Save and Publish</Menu.Item>
                        </Menu>
                    )}
                    style={{ margin: 0 }}
                    onClick={() => handleSave('save')}
                >
                    <SaveOutlined/> Save
                </Dropdown.Button>,
            ]}
            loading={isLoading}
            onBack={() => history.goBack()}
        >
            {errors.map((error, i) => (
                <Alert
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    showIcon
                    type="error"
                    message={error}
                    style={{ marginBottom: i === errors.length - 1 ? 16 : 4 }}
                />
            ))}

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    ...spec,
                    modelId: (spec.modelId || '').toString(),
                    keywords: (spec.keywords || '').split(',').filter(Boolean),
                    models: (spec.models || []).map(item => item.id.toString()),
                    status: spec.status || 'processing',
                }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="modelId"
                    label="Model"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select>
                        {models.map(model => (
                            <Select.Option key={model.id}>{model.title}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Row gutter="24">
                    <Col span="12">
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[
                                {
                                    whitespace: true,
                                    required: true,
                                    min: 2,
                                },
                            ]}
                            onChange={(event) => {
                                if (!formState.isSlugTouched) {
                                    form.setFieldsValue({
                                        slug: transformSlug(event.target.value),
                                    });
                                }
                            }}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>

                    <Col span="12">
                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                                {
                                    whitespace: true,
                                    required: true,
                                    min: 2,
                                },
                            ]}
                            getValueFromEvent={event => transformSlug(event.target.value)}
                            onChange={(event) => {
                                if (!event.target.value) {
                                    setFormState(state => ({ ...state, isSlugTouched: false }));
                                } else if (!formState.isSlugTouched) {
                                    setFormState(state => ({ ...state, isSlugTouched: true }));
                                }
                            }}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="keywords"
                    label="Keywords"
                    rules={[
                        {
                            type: 'array',
                            required: true,
                            min: 2,
                        },
                        {
                            validator: (rule, value) => {
                                if (Array.isArray(value) && value.some(v => !v.trim())) {
                                    return Promise.reject(new Error(`'${rule.field}' cannot have empty tags`));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Select
                        mode="tags"
                        tokenSeparators={[',']}
                        notFoundContent={null}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            min: 2,
                        },
                    ]}
                >
                    <Input.TextArea rows="4"/>
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Content"
                    valuePropName="data"
                    getValueFromEvent={(event, editor) => editor.getData()}
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            min: 2,
                        },
                    ]}
                >
                    <TextEditor/>
                </Form.Item>

                <Form.Item
                    name="sections"
                    label="Sections"
                    valuePropName="my_data"
                    getValueFromEvent={() => []}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <div>
                        {(spec.sections || []).map((section, i) => (
                            <Table
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                bordered
                                title={() => (<h3 style={{ marginBottom: 0 }}>{section.title}</h3>)}
                                size="small"
                                pagination={false}
                                columns={[
                                    {
                                        title: 'Name',
                                        dataIndex: 'name',
                                        width: '50%',
                                    },
                                    {
                                        title: 'Value',
                                        dataIndex: 'value',
                                    },
                                ]}
                                dataSource={section.items}
                                style={{ marginBottom: 16 }}
                            />
                        ))}
                    </div>
                </Form.Item>

                <Form.Item
                    name="thumbnail"
                    label="Thumbnail"
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            min: 2,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Image"
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            min: 2,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    style={{ marginBottom: 0 }}
                >
                    <Select>
                        <Select.Option value="processing">Processing</Select.Option>
                        <Select.Option value="published">Published</Select.Option>
                        <Select.Option value="warning">Warning</Select.Option>
                        <Select.Option value="error">Error</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Wrapper>
    );
}
