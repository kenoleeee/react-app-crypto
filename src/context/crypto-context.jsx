import { createContext, useState, useEffect, useContext } from 'react';
import { fakeFetchCrypto, fetchAssets } from '../api';
import { percentDifference } from '../utils';

const CryptoContext = createContext({
    assets: [],
    cryptoData: [],
    loading: false,
});


export function CryptoContextProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [crypto, setCrypto] = useState([]);
    const [assets, setAssets] = useState([]);


    function mapAssets(asset, result) {
        return asset.map(asset => {
            const coin = result.find(coin => coin.id === asset.id);

            return {
                grow: asset.price < coin.price,
                growPercent: percentDifference(asset.price, coin.price),
                totalAmount: asset.amount * coin.price,
                totalProfit: asset.amount * coin.price - asset.amount * asset.price,
                name: coin.name,
                ...asset,
            };
        });
    };

    useEffect(() => {
        async function preload() {
            setLoading(true);
            const { result } = await fakeFetchCrypto();
            const assets = await fetchAssets();


            setCrypto(result);
            setAssets(mapAssets(assets, result));
            setLoading(false);

        }
        preload();
    }, [])

    function addAsset(newAsset) {
        setAssets(prev => mapAssets([...prev, newAsset], crypto))
    }

    return <CryptoContext.Provider value={{ loading, crypto, assets, addAsset }}>
        {children}
    </CryptoContext.Provider>
};

export default CryptoContext;

export const useCrypto = () => {
    return useContext(CryptoContext);
}