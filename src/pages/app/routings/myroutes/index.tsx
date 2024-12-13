import { useEffect, useState } from 'react';
import styles from './myroutes.module.scss';
import Loader from '../../../../components/loader';
import Filter from '../../../../components/filter';
import generateRandomNonce from '../../../../components/functions/nonce';
import { useRouter } from 'next/router';

export default function AllRoute() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [routesProps, setRoutesProps] = useState([]);
    const [maxDate, setMaxDate] = useState("");
    const [minDate, setMinDate] = useState("");

    useEffect(() => {
        if(minDate !== "" && maxDate !== "") {
            getMyRoutesProps();
        }
    },[minDate, maxDate]);

    useEffect(() => {
        const data = new Date();

        const dateFormated = data.getFullYear() + '-' + ("0"+(data.getMonth()+1)).slice(-2) + '-' + ("0"+data.getDate()).slice(-2);
        setMinDate(dateFormated);
        setMaxDate(dateFormated);
    },[]);
    

    async function getMyRoutesProps() {
        await fetch('/getMyRoutesProps', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`,
                dmin: minDate,
                dmax: maxDate
            }
        }).then(async response => {
            const data = await response.json();
            setRoutesProps([...data]);
            setLoading(false);
        })
    }

    return (
        <>
            <div className={styles.allContent}>
                {loading ? <Loader/> : 
                <>
                    <Filter callback={(e) => {
                        setMinDate(e.minDate);
                        setMaxDate(e.maxDate);
                    }}/>
                    <div className={styles.listOfRoutes}>
                        {routesProps.map((props, index) => {
                            return (
                                <>
                                    <div className={styles.routeList} key={index.toString()} onClick={()=> {
                                        router.push(`/app/routings/${props.ROUTE}`);
                                    }}>
                                        <div className={styles.headerRoute}>
                                            <h1>{props.ROUTE}</h1>
                                        </div>
                                        <div className={styles.routeInformations}>
                                            <div className={styles.boxInfo}>
                                                <p>Metros</p>
                                                <h1>{props.METERS ?? 0} Metros</h1>
                                            </div>
                                            <div className={styles.boxInfo}>
                                                <p>Itens na Rota</p>
                                                <h1>{props.UCINROUTE ?? 0}</h1>
                                            </div>
                                            <div className={styles.boxInfo}>
                                                <p>Locais na rota</p>
                                                <h1>{props.STORES ?? 0}</h1>
                                            </div>
                                            <div className={styles.boxInfo}>
                                                <p>Criado</p>
                                                <h1>{props.CREATE_BY} ás {props.CREATE_AT}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </>}
            </div>
        </>
    )
}