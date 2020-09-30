import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
    message,
    Form,
    Select,
    Input,
    Button,
    Menu,
    Dropdown,
    Divider,
    Alert,
    Rate,
    Switch,
    Row,
    Col,
    Modal,
} from 'antd';
import { SaveOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import Wrapper from '../../components/wrapper';
import TextEditor from '../../components/text-editor';
import { fetchModel, saveModel, removeModel } from '../../slices/models-slice';

function transformSlug(value) {
    return value.toLowerCase().replace(/[\W_]+/g, '-');
}

export default function ModelsEdit() {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.models.isLoading);
    const brands = useSelector(state => state.models.brands);
    const ratings = useSelector(state => state.models.ratings);
    const model = useSelector(state => state.models.models.find(model => model.id === +params.id)) || {};
    const errors = useSelector(state => state.models.errors);

    const [galleryFormState, setGalleryFormState] = useState({
        isSlugTouched: false,
        visible: false,
    });
    const [galleryForm] = Form.useForm();

    const [formState, setFormState] = useState({
        isSlugTouched: false,
    });
    const [form] = Form.useForm();

    useEffect(
        () => {
            dispatch(fetchModel(params.id));
        },
        [dispatch, params.id],
    );

    useEffect(
        () => {
            form.resetFields();
        },
        [form, model.id],
    );

    async function handleRemove() {
        message.loading({
            key: 'remove',
            content: 'Model removing...',
        });

        await dispatch(removeModel(params.id));

        history.replace('/admin/models');

        message.success({
            key: 'remove',
            content: 'Model successfully removed',
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

    async function handleSubmit(modelData) {
        message.loading({
            key: 'save',
            content: 'Model saving...',
        });

        const modelId = await dispatch(saveModel(params.id, {
            ...modelData,
            keywords: modelData.keywords.join(','),
        }));
        if (!modelId) {
            message.error({
                key: 'save',
                content: 'Errors occurred while model saving!',
            });
            return;
        }

        if (params.id === 'new') {
            history.replace(`/admin/models/${modelId}`);
        } else {
            form.resetFields();
        }

        message.success({
            key: 'save',
            content: 'Model successfully saved!',
        });
    }

    function handleOk() {
        galleryForm.submit();
    }

    function handleCancel() {
        setGalleryFormState(state => ({ ...state, visible: false }));
    }

    return (
        <Wrapper
            title={`${params.id === 'new' ? 'New' : 'Edit'}${model && model.title ? ` "${model.title}" ` : ' '}model`}
            extra={[
                <Button
                    key="remove"
                    type="danger"
                    icon={<DeleteOutlined/>}
                    onClick={() => {
                        Modal.confirm({
                            title: 'Are you sure delete this model?',
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
                    ...model,
                    brandId: (model.brandId || '').toString(),
                    keywords: (model.keywords || '').split(',').filter(Boolean),
                    ratings: (model.ratings || []).map(item => item.id.toString()),
                    status: model.status || 'processing',
                }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="brandId"
                    label="Brand"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select>
                        {brands.map(brand => (
                            <Select.Option key={brand.id}>{brand.title}</Select.Option>
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
                    name="subTitle"
                    label="Sub title"
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

                <Row gutter="24">
                    <Col span="16">
                        <Form.Item
                            name="price"
                            label="Price"
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
                    </Col>

                    <Col span="4">
                        <Form.Item
                            name="rate"
                            label="Rate"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Rate allowHalf/>
                        </Form.Item>
                    </Col>

                    <Col span="4">
                        <Form.Item
                            name="choice"
                            label="Choice"
                            valuePropName="checked"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Switch/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter="24">
                    <Col span="8">
                        <Form.Item
                            name="highs"
                            label="Highs"
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
                    </Col>

                    <Col span="8">
                        <Form.Item
                            name="lows"
                            label="Lows"
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
                    </Col>

                    <Col span="8">
                        <Form.Item
                            name="verdict"
                            label="Verdict"
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
                    </Col>
                </Row>

                <Form.Item
                    name="ratings"
                    label="Ratings"
                >
                    <Select
                        mode="multiple"
                        optionFilterProp="children"
                        notFoundContent={null}
                    >
                        {ratings.map(rating => (
                            <Select.Option key={rating.id}>{rating.title}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                >
                    <Select>
                        <Select.Option value="processing">Processing</Select.Option>
                        <Select.Option value="published">Published</Select.Option>
                        <Select.Option value="warning">Warning</Select.Option>
                        <Select.Option value="error">Error</Select.Option>
                    </Select>
                </Form.Item>
            </Form>

            <Modal
                title="Gallery"
                width="640px"
                visible={galleryFormState.visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={galleryForm}
                    layout="vertical"
                    initialValues={{
                        ...model.gallery,
                        keywords: ((model.gallery && model.gallery.keywords) || '').split(',').filter(Boolean),
                        status: (model.gallery && model.gallery.status) || 'processing',
                    }}
                    onFinish={handleSubmit}
                >
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
                </Form>
            </Modal>

            <Button type="button" onClick={() => setGalleryFormState(state => ({ ...state, visible: true }))}>
                Gallery
            </Button>
            <Button>Specs</Button>
        </Wrapper>
    );
}
