import { Col, DatePicker, Form } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useMemo } from 'react';
interface Props extends React.ComponentProps<typeof Form.Item> {
    labelKey?: string;
    span?: number;
    placeholder?: string;
    disabledDate?: (date: any) => boolean;
    dateFormat: string;
    isStaff?: boolean;
    isEdit?: boolean;
    hiddenInitValue?: boolean;
    spanFormItem?: number;
    label?: string;
    disableDate?: any;
}

export function BaseDatePicker(props: Props) {
    const rules = useMemo(() => {
        return getRules(props);
    }, [props]);
    return (
        <Col span={props.span || 6}>
            <Form.Item
                name={props.name}
                labelAlign="left"
                rules={rules}
                label={props?.label}
                {...props}
                className="label"
                initialValue={undefined}
                wrapperCol={{
                    span: props?.spanFormItem || 24
                }}
            >
                <DatePicker
                    size="large"
                    placeholder={
                        props?.labelKey
                    }
                    style={{ width: '100%' }}
                    format={props.dateFormat}
                    disabled={props.isEdit && props.isStaff}
                    disabledDate={(date) => props.disableDate(date)}
                />
            </Form.Item>
        </Col>
    );
}

const getRules = (props: Props) => {
    if (props.required) {
        let rules: Rule[] = [];

        rules.push({
            required: true,
            message: "LOoix"
        });

        if (props.rules) {
            rules = [...rules, ...props.rules];
        }

        return rules;
    }

    return undefined;
};
