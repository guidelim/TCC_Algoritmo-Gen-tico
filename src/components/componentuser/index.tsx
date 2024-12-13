import styles from './user.module.scss';
import { useEffect, useState } from "react";
import pageChanger from '../functions/pageChange';
import { useRouter } from 'next/router';
import nonce from '../functions/nonce';
import generateRandomNonce from '../functions/nonce';

export default function ComponentUsers({visible, callback}) {
    const [photoUser, setPhotoUser] = useState("");
    const [username, setUsername] = useState("");
    const [nvlAccess, setNvlAccess] = useState("");
    const router = useRouter();
    const [dropSets, setDropSets] = useState([{
        route: false,
        rel: false
    }])


     const getInfoUser = async () => {
        fetch("/infouser", {
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                      'Authorization': `Bearer ${await generateRandomNonce()}`
            },
        }).then(async props => {
            const data = await props.json();
            
            setUsername(data[0]?.USRNAME?.split("(")[0]);
            setNvlAccess(data[0]?.NVLACCESS);
            
            setPhotoUser("/dhl.svg")
        })
     }


    useEffect(() => {
        getInfoUser()
    },[])   

    async function LogOut() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = `https://smarthub.systempe.com.br/app`
    }

    async function pageRequestChanger(page) {
        const response = await pageChanger(page);
        if(response == 200) {
            router.push(page);
        }
    }

    return (
        <>
            <div className={styles.content}>
                {visible ? <>
                <div className={styles.containerUser}>
                    <div className={styles.dhlProps}>
                        <div className={styles.imgs}>
                            <h1>CrossRota</h1>
                        </div>
                    </div>
                    <div className={styles.infoUser}>
                        <div className={styles.userProps}>
                            <h1>{username}</h1>
                            <h1>Acesso: {nvlAccess}</h1>
                        </div>
                    </div>
                    <div className={styles.boxNavBar}>
                        <div className={styles.boxItemNavigator} onClick={()=>pageRequestChanger("/app")}>
                            <img src="/direct.svg"/>
                            <h1>Roteirizar</h1>
                        </div>
                        <div className={styles.boxItemNavigator}  onClick={()=>{
                                let tmpArr = [...dropSets];
                                tmpArr[0].route = tmpArr[0].route ? false : true;
                                setDropSets([...tmpArr]);
                            }}>
                            <img src="/route.svg"/>
                            <h1>Rotas</h1>
                            <div className={styles.expand}>
                                {dropSets[0]?.route ? 
                                <img src="/expandless.svg"/>:
                                <img src="/expandmore.svg"/>    
                            }
                            </div>
                        </div>
                        <div className={`${styles.dropDownItem} ${dropSets[0]?.route ? styles.show : ''}`}>
                            <div className={styles.selectorDrop} onClick={()=>pageRequestChanger("/app/routings/myroutes")}>
                                <p>•</p>
                                <h1>Minhas rotas</h1>
                            </div>
                            {/*nvlAccess == "ADMIN" ?*/}
                            <div className={styles.selectorDrop} onClick={()=>pageRequestChanger("/app/routings/allroutes")}>
                                <p>•</p>
                                <h1>Rotas</h1>
                            </div>{/*:null*/}
                        </div>
                        {/*nvlAccess == 'ADMIN' ? <>*/}
                        <div className={styles.boxItemNavigator}  onClick={()=>{
                                let tmpArr = [...dropSets];
                                tmpArr[0].rel = tmpArr[0].rel ? false : true;
                                setDropSets([...tmpArr]);
                            }}>
                            <img src="/excel.svg"/>
                            <h1>Relatórios</h1>
                            <div className={styles.expand}>
                                {dropSets[0]?.rel ? 
                                <img src="/expandless.svg"/>:
                                <img src="/expandmore.svg"/>    
                            }
                            </div>
                        </div>
                        <div className={`${styles.dropDownItem} ${dropSets[0]?.rel ? styles.show : ''}`}>
                            <div className={styles.selectorDrop} onClick={()=>pageRequestChanger("/app/export/routeinfos")}>
                                <p>•</p>
                                <h1>Informações das Rotas</h1>
                            </div>
                            <div className={styles.selectorDrop} onClick={()=>pageRequestChanger("/app/export/routing")}>
                                <p>•</p>
                                <h1>Roteirização</h1>
                            </div>
                        </div>
                        {/*
                        <div className={styles.boxItemNavigator} onClick={()=>pageRequestChanger("/app/uploadSapFile")}>
                            <img src="/sap.svg"/>
                            <h1>Atualizar base SAP</h1>
                        </div>
                        <div className={styles.boxItemNavigator} onClick={()=>LogOut()}>
                            <img src="/logout.svg"/>
                            <h1>Smart HUB</h1>
                        </div></>:null*/}
                    </div>
                    <div className={styles.developerProps}>
                        {/*<img src="/dhl.svg"/></>:null*/}
                        <h1>Powered by 2101205 | 2106575 | 2104619</h1>
                    </div>
                </div>
                </>:null}
                <div className={styles.slider} onClick={()=>{
                    callback()
                }}>
                    <div className={styles.boxImg}>
                        {!visible ? 
                        <img src="/arrowgo.svg"/>:
                        <img src="/arrowback.svg"/>}
                    </div>
                </div>
            </div>
        </>
    )
}