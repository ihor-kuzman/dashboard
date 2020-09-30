import React, { useState, useEffect } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import * as ClassicEditor from '../packages/ckeditor/ckeditor';

import './text-editor.scss';

export default function TextEditor(props) {
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {
            const timeoutId = setTimeout(() => setLoading(false), 500);
            return () => clearTimeout(timeoutId);
        },
        [],
    );

    if (loading) {
        return (
            <Spin spinning={loading} indicator={<LoadingOutlined spin/>}>
                <div style={{ height: 289, border: '1px solid #d9d9d9' }}/>
            </Spin>
        );
    }
    return (
        <CKEditor
            editor={ClassicEditor}
            config={{
                toolbar: {
                    items: [
                        'undo', 'redo', '|',
                        'heading', 'fontSize', 'alignment', '|',
                        'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
                        'bulletedList', 'numberedList', '|',
                        'indent', 'outdent', '|',
                        'blockQuote', 'link', 'imageUpload', 'mediaEmbed', '|',
                        'removeFormat',
                    ],
                },
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'imageStyle:alignLeft',
                        'imageStyle:full',
                        'imageStyle:alignRight',
                    ],
                    styles: [
                        'full',
                        'alignLeft',
                        'alignRight',
                    ],
                },
                table: {
                    contentToolbar: [
                        'tableRow',
                        'tableColumn',
                        'mergeTableCells',
                        'tableProperties',
                        'tableCellProperties',
                    ],
                },
                language: 'en',
            }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
}
