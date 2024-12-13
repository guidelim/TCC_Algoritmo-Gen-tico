import { useEffect, useState } from 'react';
import styles from './route.module.scss';
import Loader from '../../../../components/loader';
import Filter from '../../../../components/filter';
import generateRandomNonce from '../../../../components/functions/nonce';
import * as xlsx from 'xlsx';

export default function AllRoute() {
    const [loading, setLoading] = useState(true);
    const [routesProps, setRoutesProps] = useState([]);
    const [maxDate, setMaxDate] = useState("");
    const [minDate, setMinDate] = useState("");

    useEffect(() => {
        if(minDate !== "" && maxDate !== "") {
            getRoutesProps();
        }
    },[minDate, maxDate]);

    useEffect(() => {
        const data = new Date();

        const dateFormated = data.getFullYear() + '-' + ("0"+(data.getMonth()+1)).slice(-2) + '-' + ("0"+data.getDate()).slice(-2);
        setMinDate(dateFormated);
        setMaxDate(dateFormated);
    },[]);
    

    async function getRoutesProps() {
        await fetch('/getRoutesProps', {
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

    function extractUsersRel() {
        const data = routesProps;

        let d = new Date();
        let dia = parseInt(("00" + d.getDate()).slice(-2)) + "-" + (parseInt(("00" + d.getMonth()).slice(-2))+1)
        let wb = xlsx.utils.book_new();
        let ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Infos Rotas " + dia);
        xlsx.writeFile(wb, "Infos Rotas " + dia + ".xlsx");
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
                    <div className={styles.export}>
                        <img src="/excel.svg" onClick={extractUsersRel}/>
                    </div>
                    <div className={styles.listOfRoutes}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rota</th>
                                    <th>Metros</th>
                                    <th>Itens na rota</th>
                                    <th>Locais</th>
                                    <th>Criado ás</th>
                                    <th>Iniciado ás</th>
                                    <th>Finalizado ás</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routesProps.map((props, index) => {
                                    return (
                                        <>
                                            <tr id={index.toString()}>
                                                <th>{props.ROUTE}</th>
                                                <th>{props.METERS}</th>
                                                <th>{props.UCINROUTE}</th>
                                                <th>{props.STORES}</th>
                                                <th>{props.CREATE_AT}</th>
                                                <th>{props.INIT_AT}</th>
                                                <th>{props.FINISH_AT}</th>
                                            </tr>
                                        </>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </>}
            </div>
        </>
    )
}