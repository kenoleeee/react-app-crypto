import { Layout, Select, Space, Button, Modal } from 'antd';
import { useCrypto } from '../../context/crypto-context';
import { useState, useEffect } from 'react';
import CryptoInfoModal from '../CryptoInfoModal';

const headerStyle = {
    textAlign: 'center',
    width: '100%',
    height: 60,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const showModal = () => {
    setIsModalOpen(true);
};



export default function AppHeader() {
    const [select, setSelect] = useState(false);
    const [modal, setModal] = useState(false);
    const { crypto } = useCrypto();
    const [coin, setCoin] = useState(null);

    useEffect(() => {
        const keypress = event => {
            if (event.key === '/') {
                setSelect((prev => !prev));
            }
        }
        document.addEventListener('keypress', keypress);
        return () => {
            document.removeEventListener('keypress', keypress);
        }
    }, []);

    const handleSelect = (value) => {
        setCoin(crypto.find(coin => coin.id === value));
        setModal(true);
    };

    return (
        <Layout.Header style={headerStyle}>
            <Select
                style={{
                    width: 250
                }}
                open={select}
                onSelect={handleSelect}
                onClick={() => setSelect(prev => !prev)}
                value="press / open"
                placeholder="Select Asset"
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
            <Button type="primary">Add Asset</Button>

            <Modal
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={modal}
                onCancel={() => setModal(false)}
                footer={null}
            >
                <CryptoInfoModal coin={coin} />
            </Modal>

        </Layout.Header>
    )
}