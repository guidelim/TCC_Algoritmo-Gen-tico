import { useEffect, useState } from 'react';
import styles from './road.module.scss';

export default function RoadHorizontal({locales, route}){
    const [lastXPosition, setLastXPosition] = useState(-1);
    const [locals, setLocals] = useState([]);

    useEffect(() => {
        addLocaleBlankInLocales();
        setArrowFromRoute();
    },[route]);


    function addLocaleBlankInLocales(){
        let arrLocale = [];
        let numberToContinue = 66

        for(let i = 0; i < 15; i++){
            arrLocale.push({
                LOCALE: '',
                X: numberToContinue + i,
                Y: 12,
                EIXO: 'HORIZONTAL',
                BLOCO: 'A'
            });
        }

        setLocals([...locales,...arrLocale]);
    }

    function setArrowFromRoute() {
        let routesLen = route.length;
        let maxX = 0;

        for(let i = 0; i < routesLen; i++) {

            if(route[i].X > maxX) {
                maxX = route[i].X;
                setLastXPosition(i);
            }
        }
    }

    return (
        <>
            <div className={styles.roadAll}>
                <div className={styles.storeSide}>
                    <div className={styles.spacer}>
                        {route[0]?.EIXO == "HORIZONTAL" && route[route.length - 1]?.EIXO == "VERTICAL" ?
                            <>
                                <span className={styles.spacerCurve}></span>
                                <img src="/routeRightCurve.svg" className={styles.right}/>
                            </>:
                        route[0]?.EIXO == "VERTICAL" && route[route.length - 1]?.EIXO == "HORIZONTAL" ?
                            <>
                                <span className={styles.spacerCurve}></span>
                                <img src="/routeLeftCurve.svg" className={styles.left}/>
                            </>:
                            <span className={styles.spacerNoCurve}></span>
                        }
                    </div>
                    {locals.filter(info => !info.LOCALE?.startsWith("DOCA")).map((props, index)=>{
                        return(
                            <>
                                <div className={styles.storeOrientation} id={index.toString()}>
                                    {
                                    route.filter(info => info.LOCALE == props.LOCALE).length > 0 ?
                                        <img src="/routeUpGreen.svg"/> :
                                    props.X > route[lastXPosition]?.X? 
                                    null :
                                    props.X + 15 < route[lastXPosition]?.X? 
                                    null :
                                    props.X > route[0].X && route[0].EIXO == "VERTICAL" ?
                                        <img src="/routeright.svg"/>:
                                    props.X < route[0].X + 15 ?
                                        <img src="/routeLeft.svg"/>:
                                        null
                                    }
                                </div>
                            </>
                        )
                    })}
                </div>
                {route[0].EIXO == "HORIZONTAL" ?<>
                <div className={styles.storeSide}>
                    {route[0].LOCALE == "DOCA 112" || route[0].LOCALE == "DOCA 113" ?
                    <>
                    <div className={styles.storeOrientation}>
                        {route[0].LOCALE == "DOCA 112" ?
                            <img src="/routeLeft.svg"/>:
                            null
                        }
                    </div>
                    <div className={styles.storeOrientation}>
                        {route[0].LOCALE == "DOCA 112" ?
                            <img src="/routeLeft.svg"/>:
                            null
                        }
                    </div>
                    <div className={styles.storeOrientation}>
                        {route[0].LOCALE == "DOCA 113" ?
                            <img src="/routeLeft.svg"/>:
                            null
                        }
                    </div>
                    </>:
                    <div className={styles.spacer}>
                        <span className={styles.spacerNoCurve}></span>
                    </div>}
                    {locals.filter(info => !info.LOCALE?.startsWith("DOCA")).map((props, index)=>{
                        return(
                            <>
                                <div className={styles.storeOrientation} id={index.toString()}>
                                    {props.LOCALE == route[lastXPosition].LOCALE ?
                                        <img src="/routeUpGreen.svg"/> :
                                    props.X > route[lastXPosition].X ?
                                        null:
                                    props.X + 15 < route[0].X ?
                                        null:
                                    props.X > route[0].X && props.X < route[lastXPosition].X ?
                                        <img src="/routeLeft.svg"/>:
                                    route[0].X >= props.X && route[lastXPosition].X == route[0].X?
                                        null:
                                        <img src="/routeRight.svg" alt="" />
                                    }
                                </div>
                            </>
                        )
                    })}
                </div>
                </>:null}
                <div className={styles.divisor}>
                    <span></span>
                </div>
                <div className={styles.dockSide}>
                    {locales.filter(info => info.LOCALE?.startsWith("DOCA")).map((props, index)=>{
                        return(
                            <>
                                <div className={styles.dockOrientation} id={index.toString()}>
                                    {route.filter(info => info.LOCALE == props.LOCALE).length > 0 ?
                                            <img src="/routeUpGreen.svg"/>
                                        :
                                        null
                                    }
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}