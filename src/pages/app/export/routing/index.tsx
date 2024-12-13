import { useEffect, useState } from 'react';
import styles from './route.module.scss';
import Loader from '../../../../components/loader';
import generateRandomNonce from '../../../../components/functions/nonce';
import * as xlsx from 'xlsx';
import Alerta from '../../../../components/alert';

export default function AllRoute() {
    const [loading, setLoading] = useState(true);
    const [routesProps, setRoutesProps] = useState([]);
    const [routeId, setRouteID] = useState('');
    const [msgAlerta, setMsgAlerta] = useState('');
    const [alertaOn, setAlertaOn] = useState(false);

    async function searchRouteId() {
        if(routeId == "") {
            setMsgAlerta('Digite o numero da rota.');
            setAlertaOn(true);
            return;
        }

        await fetch('/getRouteInformations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`,
                id: routeId
            }
        }).then(async response => {
            const data = await response.json();
            if(data.length == 0){
                setMsgAlerta('Nenhuma rota encontrada.');
                setAlertaOn(true);
            } else {
                setRoutesProps([...data]);
                setLoading(false);
            }
        })
    }

    function extractUsersRel() {
        const data = routesProps;

        let d = new Date();
        let dia = parseInt(("00" + d.getDate()).slice(-2)) + "-" + (parseInt(("00" + d.getMonth()).slice(-2))+1)
        let wb = xlsx.utils.book_new();
        let ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, `${routeId} - Rota` + dia);
        xlsx.writeFile(wb, `${routeId} - Rota ` + dia + ".xlsx");
    }

    function handleClose() {
        setAlertaOn(false);
    }

    return (
        <>
            <div className={styles.allContent}>
                {alertaOn ? <Alerta mensagem={msgAlerta} tipo={"warning"} onClose={handleClose} autoClose={2000}/>:null}
                {loading ? <>
                <div className={styles.boxInput}>
                    <div className={styles.inputRouteId}>
                        <h1>Número da Rota</h1>
                        <input type="text" value={routeId} onChange={(e)=>{setRouteID(e.target.value.toUpperCase())}}/>
                    </div>
                    <button onClick={searchRouteId}>Pesquisar</button>
                </div>
                </> : 
                <>
                    <div className={styles.export}>
                        <img src="/excel.svg" onClick={extractUsersRel}/>
                    </div>
                    <div className={styles.listOfRoutes}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rota</th>
                                    <th>Ordem</th>
                                    <th>Item</th>
                                    <th>Código da Loja</th>
                                    <th>Entregue ás</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routesProps.map((props, index) => {
                                    return (
                                        <>
                                            <tr id={index.toString()}>
                                                <th>{props.LOCALE}</th>
                                                <th>{props.ORDERLOCALE}</th>
                                                <th>{props.UC}</th>
                                                <th>{props.LOC}</th>
                                                <th>{props.LOCALE_AT}</th>
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