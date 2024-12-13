import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './id.module.scss';
import Loader from "../../../../components/loader";
import generateRandomNonce from "../../../../components/functions/nonce";
import DocksHorizontal from "../../../../components/docks/horizontal";

export default function RouteID(){
    const router = useRouter();
    const [routeID, setRouteID] = useState('');

    const [localeActual, setLocaleActual] = useState([]);
    const [localeNext, setLocaleNext] = useState([]);
    const [routeProps, setRouteProps] = useState([]);
    const [routeFinished, setRouteFinished] = useState(false);

    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        const id = router.query.id;

        if(id !== undefined) {
            setRouteID(id.toString())
        }
    },[router.query.id]);

    useEffect(() => {
        if(routeID !== '') {
            getRouteInformations();
        }
    },[routeID])


    async function getRouteInformations() {
        await fetch('/getRouteInformations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`,
                id: routeID
            }
        }).then(async response => {
            const data = await response.json();
            
            setRouteProps([...data]);

            if(data[0]?.LOCALE_AT == null) {
                registerInitRoute()
            }

            if(data[data.length - 1]?.LOCALE_AT !== null) {
                setRouteFinished(true);
                checkIfRouteFinished()
                return;
            }

            for(let i = 0; i < data.length - 1; i++) {
                if(data[i + 1].LOCALE_AT == null) {
                    setLocaleActual([data[i]]);
                    setLocaleNext([data[i + 1]]);
                    return;
                }
            }
        })
        setLoading(false)
    }

    async function registerNextStore() {
        await fetch('/registerStayInStore',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`,
                id: routeID,
                position: localeNext[0]?.ORDERLOCALE
            }
        }).then(async response => {
            if(response.ok) {
                getRouteInformations();
            }
        })
    }

    async function registerInitRoute(){
        await fetch('/registerStayInStore',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`,
                id: routeID,
                position: '1'
            }
        })
    }

    async function checkIfRouteFinished() {
        await fetch('/checkIfRouteFinished',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`,
                id: routeID
            }
        })
    }

    return (
        <>
            <div className={styles.allContent}>
                {loading ?  
                <Loader/>
                :
                <>
                <div className={styles.routeAll}>
                    <div className={styles.routeToLocal}>
                        {routeFinished ? 
                        <>
                        <div className={styles.tableRoute}>
                            <div className={styles.tableHeader}>
                                <h1>Rota Finalizada!</h1>
                                <img src="/done.svg"/>
                            </div>
                            <div className={styles.table}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Local</th>
                                            <th>Ordenação</th>
                                            <th>Item</th>
                                            <th>Entregue ás</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routeProps.map((props, index) => {
                                            return (
                                                <>
                                                    <tr key={index.toString()}>
                                                        <th>{props.LOCALE}</th>
                                                        <th>{props.ORDERLOCALE}</th>
                                                        <th>{props.UC}</th>
                                                        <th>{props.LOCALE_AT}</th>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </>:<>
                        <div className={styles.boxLocal}>
                            <h2>{localeActual[0]?.LOCALE}</h2>
                        </div>
                        <img src="/routedownGreen.svg"/>
                        <div className={styles.boxLocal}>
                            <h2>{localeNext[0]?.LOC}</h2>
                            {routeProps.filter(info => info.LOCALE==localeNext[0]?.LOCALE).map((props, index)=>{
                                return(
                                    <>
                                        <p>Item {props.UC}</p>
                                    </>
                                )
                            })}
                        </div>
                        <div className={styles.buttonNextStore}>
                            <button onClick={registerNextStore}>Próximo Local</button>
                        </div></>}
                    </div>
                </div>
                </>}
            </div>
        </>
    )
}


/*
    <div className={styles.allContentMap}>
        <div className={styles.blocoJ}>
            <div className={styles.blocoAVertical}>
                <div className={styles.dockInfosDirection}>
                    <DocksVertical docks={locales.filter(info => info.BLOCO=='J' && info.EIXO=='VERTICAL' && info.LOCALE?.startsWith('DOCA'))}/>
                </div>
                <div className={styles.storesInfos}>
                    <div className={styles.storesBox}>
                        <div className={styles.roadVertical}>
                            <RoadVerticalJ locales={locales.filter(info => info.BLOCO=='J')} route={routeProps} allLocales={locales}/>
                        </div>
                        <div className={styles.storesInfos}>
                            <StoresVertical stores={locales.filter(info => info.BLOCO=='J' && info.EIXO=='VERTICAL' && !info.LOCALE?.startsWith('DOCA'))}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className={styles.blocoDivisor}>
        <span>PORTAL (J-A)</span>
    </div>
    <div className={styles.allContentMap}>
        <div className={styles.blocoA}>
            <div className={styles.blocoAVertical}>
                <div className={styles.dockInfosDirection}>
                    <DocksVertical docks={locales.filter(info => info.BLOCO=='A' && info.EIXO=='VERTICAL' && info.LOCALE?.startsWith('DOCA'))}/>
                </div>
                <div className={styles.storesInfos}>
                    <div className={styles.storesBox}>
                        <div className={styles.roadVertical}>
                            <RoadVerticalA locales={locales.filter(info => info.BLOCO=='A' && info.EIXO=='VERTICAL')} route={routeProps} allLocales={locales}/>
                        </div>
                        <div className={styles.storesInfos}>
                            <StoresVertical stores={locales.filter(info => info.BLOCO=='A' && info.EIXO=='VERTICAL' && !info.LOCALE?.startsWith('DOCA'))}/>
                            <StoresHorizontal stores={locales.filter(info => info.BLOCO=='A' && info.EIXO=='HORIZONTAL' && !info.LOCALE?.startsWith('DOCA'))}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.horizontalOrientacion}>
                <div className={styles.block}>
                    <span></span>
                </div>
                <div className={styles.propsHorizontal}>
                    <div className={styles.roadHorizontal}>
                        <RoadHorizontal locales={locales.filter(info => info.BLOCO=='A' && info.EIXO=='HORIZONTAL')} route={routeProps}/>
                    </div>
                    <div className={styles.boxDocksHorizontal}>
                        <DocksHorizontal docks={locales.filter(info => info.BLOCO=='A' && info.EIXO=='HORIZONTAL' && info.LOCALE?.startsWith('DOCA'))}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
*/ 