import { Flex, Typography, Divider } from 'antd';

export default function CoinInfo({ coin, showSymbol }) {
    return <Flex align='center'>
        <img src={coin.icon}
            alt={coin.name}
            style={{ width: 40, marginRight: 10 }} />
        <Typography.Title style={{ margin: 0 }} level={2}>
            {showSymbol && <span style={{ color: 'gray' }}>({coin.symbol})</span>} {coin.name}
        </Typography.Title>
    </Flex>
}