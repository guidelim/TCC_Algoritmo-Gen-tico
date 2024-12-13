import { useEffect, useRef, useState } from "react"
import styles from "./index.module.scss"
import generateRandomNonce from "../../components/functions/nonce";
import Alerta from "../../components/alert";
import { useRouter } from "next/router";
import DecisionAlert from "../../components/alertDecision";
import SelectionStore from "../../components/selectionStore";
import SelectionDoca from "../../components/selectionDock";
import UcAndStore from "../../components/ucAndStores";
import Loading from "../../components/loading";

export default function PagePrincipal() {
    const router = useRouter();
    const scanRef = useRef(null);
    const [uc, setUc] = useState('');
    
    const [routeStores, setRouteStores] = useState([]);

    const [locales, setLocales] = useState([]);
    const [msgAlerta, setMsgAlerta] = useState('');
    const [alertaOn, setAlertaOn] = useState(false);
    const [typeAlerta, setTypeAlerta] = useState('');
    const [decisionStgOn, setDecisionStgOn] = useState(false);
    const [selectionLojaInUC, setSelectionLojainUC] = useState(false);
    const [creatingRoute, setCreatingRoute] = useState(false);
    const [selectorDoca, setSelectorDoca] = useState(false);

    useEffect(() => {
        if(scanRef.current) {
            scanRef.current.focus();
        }

        getStores()
    },[])

    async function getStores(){
        await fetch('/getStoresAndLocations', {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`
            }
        }).then(async props => {
            const response = await props.json();
            setLocales([...response]);
        })
    }

    async function checkAndGetUCInfo(value){
        if(value == "") {
            setMsgAlerta('Bipe ou digite o item.');
            setTypeAlerta('warning');
            setAlertaOn(true);
            return;
        }

        const checkUCInRoute = routeStores.filter(info => info.uc == value).length

        if(checkUCInRoute > 0) {
            setMsgAlerta('Item já adicionado.');
            setTypeAlerta('warning');
            setAlertaOn(true);
            setUc('');
            return;
        }

        await fetch('/checkAndGetUCStore', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`,
                uc: uc
            }
        }).then(async data => {
            const response = await data.json();

            if(response.exist) {
                let tmpArr = [...routeStores];
                tmpArr.push({
                    uc: response.props[0].UC,
                    store: response.props[0].LOJA?.trim(),
                    loc: response.props[0].LOC,
                    x: response.props[0].X,
                    y: response.props[0].Y,
                    eixo: response.props[0].EIXO
                })
                setRouteStores([...tmpArr]);
                setUc('');
                onAlertaNewRoute()
            } else {
                setMsgAlerta('selecione a local.');
                setSelectionLojainUC(true);
            }
        })
    }

    function onAlertaNewRoute() {
        setMsgAlerta(`Local adicionada!`);
        setTypeAlerta('sucesso');
        setAlertaOn(true);
    }

    function handleClose(){
        setAlertaOn(false);
        setDecisionStgOn(false);
        setSelectionLojainUC(false);
        setSelectorDoca(false);
    }

    async function createNewRoute(doca) {
        setCreatingRoute(true);
        
        await fetch('/createNewRoute', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${await generateRandomNonce()}`
            },
            body: JSON.stringify({doca: doca, routes: routeStores})
        }).then(async response => {
            setCreatingRoute(false);
            const data = await response.json();

            redirectUserForRoute(data.code);
        })
    };


    function redirectUserForRoute(code){
        setMsgAlerta(`Rota ${code} criada`);
        setAlertaOn(true);

        setTimeout(() => {
            router.push(`/app/routings/${code}`);
        },1500);
    }

    return (
        <>
            <div className={styles.container}>
                {creatingRoute ? <Loading message={"Criando rota..."}/> :null}
                {alertaOn ? <Alerta mensagem={msgAlerta} autoClose={1500} onClose={handleClose} tipo={typeAlerta}/>:null}
                {selectionLojaInUC ? 
                    <SelectionStore 
                        mensagem={msgAlerta} 
                        onClose={handleClose} 
                        stores={locales.filter(info => info.LD=='L')} 
                        callback={(e)=>{
                            setSelectionLojainUC(false);
                            let tmpArr = [...routeStores];
                            tmpArr.push({
                                uc: uc,
                                ...e
                            });
                            setRouteStores([...tmpArr]);
                            setUc('');
                            onAlertaNewRoute();
                        }}
                /> : null}
                {selectorDoca ? 
                    <SelectionDoca 
                        onClose={handleClose} 
                        stores={locales.filter(info => info.LD=='D')} 
                        callback={(e)=>{
                            setSelectorDoca(false);
                            createNewRoute(e)
                        }}
                /> : null}
                <div className={styles.boxUC}>
                    <div className={styles.boxInputs}>
                        <div className={styles.boxInputInfos}>
                            <h1>Escaneie a item</h1>
                            <input inputMode="numeric" type="number" ref={scanRef} value={uc} onChange={(e)=>{
                                setUc(e.target.value.trim());
                            }} onKeyDown={(e)=>{
                                if(e.key == "Enter" || e.key == "Tab") {
                                    const ucValue = e.target as HTMLInputElement;
                                    checkAndGetUCInfo(ucValue.value);
                                }
                            }}/>
                        </div>
                        {routeStores.length > 0 ? 
                        <>
                            <UcAndStore informations={routeStores} deleteOn={true} deleteItem={(e)=>{
                                let tmpArr = [...routeStores];
                                tmpArr.splice(e, 1);
                                setRouteStores([...tmpArr]);
                            }}/>
                            <div className={styles.buttonRoute}>
                                <button onClick={()=>setSelectorDoca(true)}>Roteirizar</button>
                            </div>
                        </>:null}
                    </div>
                </div>
            </div>
        </>
    )
}