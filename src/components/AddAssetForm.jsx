import { Form, Button, Select, Space, Typography, Flex, Divider, InputNumber, DatePicker, Result } from 'antd';
import { useState, useRef } from 'react';
import { useCrypto } from '../context/crypto-context';
import CoinInfo from './layout/Coininfo';

const validateMessage = {
    required: '${label} is required',
    types: {
        number: '${label} is not a valid number',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

export default function AddAssetForm({ onClose }) {
    const [form] = Form.useForm();
    const [coin, setCoin] = useState(null);
    const { crypto, addAsset } = useCrypto();
    const [success, setSuccess] = useState(false);
    const assetRef = useRef(null);



    if (success) {
        return <Result
            status="success"
            title="Successfully Added Asset!"
            subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}.`}
            extra={[
                <Button type="primary" key="console" onClick={onClose}>
                    Close
                </Button>,
            ]}
        />
    }


    if (!coin) {
        return <Select
            style={{ width: '100%' }}
            onSelect={(value) => setCoin(crypto.find(coin => coin.id === value))}
            onClick={() => setSelect(prev => !prev)}
            placeholder="Select Coin"
            options={crypto.map(coin => ({
                label: coin.name,
                value: coin.id,
                icon: coin.icon,
            }))}
            optionRender={(options) => (
                <Space>
                    <img style={{ width: 20, height: 20 }} src={options.data.icon} alt={options.data.label} /> {''}
                    {options.data.label}
                </Space>
            )}
        />
    }

    const onFinish = (values) => {
        console.log(values);
        const newAsset = {
            id: coin.id,
            amount: values.amount,
            price: values.price,
            total: values.total,
            date: values.dateAndTime?.$d ?? new Date(),
        }
        assetRef.current = newAsset;
        console.log(newAsset);
        setSuccess(true);
        addAsset(newAsset);
    };

    function handleAmountChange(value) {
        const price = form.getFieldValue('price');
        form.setFieldsValue({
            total: +(value * price).toFixed(2),
        });
    }

    function handlePriceChange(value) {
        const amount = form.getFieldValue('amount');
        form.setFieldsValue({
            total: +(amount * value).toFixed(2),
        });
    }

    return <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
        style={{ maxWidth: 600 }}
        initialValues={{
            price: coin.price.toFixed(2),
        }}
        onFinish={onFinish}
        validateMessages={validateMessage}
    >
        <CoinInfo coin={coin} />
        <Divider />

        <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, type: 'number', min: 0, }]}
        >
            <InputNumber
                placeholder="EnterAmount"
                onChange={handleAmountChange}
                style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
            label="Price"
            name="price"
        >
            <InputNumber style={{ width: '100%' }} onChange={handlePriceChange} />
        </Form.Item>

        <Form.Item
            label="Date and Time"
            name="dateAndTime"
        >
            <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
            label="Total"
            name="total"
        >
            <InputNumber disabled style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
                Add Asset
            </Button>
        </Form.Item>
    </Form>
}