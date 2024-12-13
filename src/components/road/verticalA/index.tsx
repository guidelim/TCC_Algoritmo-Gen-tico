import { useEffect, useState } from 'react';
import styles from './road.module.scss';

export default function RoadVerticalA({locales, route, allLocales}){
    const [lastYPosition, setLastYPosition] = useState(-1);
    const [locals, setLocals] = useState([]);

    useEffect(() => {
        setArrowFromRoute();
        addLocaleBlankInLocales();
    },[route])

    function setArrowFromRoute() {
        let routesLen = route.length;
        let maxY = 0;

        for(let i = 1; i < routesLen; i++) {
            if(route[i].Y > maxY) {
                maxY = route[i].Y;
                setLastYPosition(i);
            }
        }
    }

    function addLocaleBlankInLocales(){
        let arrLocale = [];
        let numberToContinue = 48;

        for(let i = 0; i < 8; i++){
            arrLocale.push({
                LOCALE: '',
                X: 24,
                Y: numberToContinue - i,
                EIXO: 'VERTICAL',
                BLOCO: 'A'
            });
        }

        setLocals([...locales,...arrLocale]);
    }

    return (
        <>
            <div className={styles.roadAll}>
                <div className={styles.dockSide}>
                    {locales.filter(info => info.LOCALE?.startsWith("DOCA")).map((props, index)=>{
                        return(
                            <>
                                <div className={styles.dockOrientation} id={index.toString()}>
                                    {route.filter(info => info.LOCALE == props.LOCALE).length > 0 ?
                                        <img src="/routelocaleGreen.svg"/>
                                    :
                                    null
                                    }
                                </div>
                            </>
                        )
                    })}
                </div>
                <div className={styles.divisor}>
                    <span></span>
                </div>
                <div className={styles.storeSide}>
                    <div className={styles.spacer}>
                        <span></span>
                    </div>
                    {
                    locals.filter(info => !info.LOCALE?.startsWith("DOCA")).map((props, index)=>{
                        return(
                            <>
                                <div className={styles.storeOrientation} id={index.toString()}>
                                    {
                                    locals.filter(info => info.LOCALE == props.LOCALE).length == 0 ?
                                    null:
                                    props.LOCALE == route[lastYPosition]?.LOCALE ?
                                        <img src="/routelocaleGreen.svg"/> :
                                    props.Y > route[lastYPosition]?.Y && props.EIXO !== route[lastYPosition]?.EIXO ?
                                        null :
                                    (props.Y + 8) > route[0].Y && route[1]?.Y >= props.Y ?
                                        <img src="/routeUp.svg"/> :
                                    props.Y < route[0].Y && route[1]?.Y <= props.Y ?
                                        <img src="/routeDown.svg"/> :
                                        null
                                    }
                                </div>
                            </>
                        )
                    })}
                </div>
                {route.filter(info => info.EIXO == "VERTICAL").length > 0 ?<>
                <div className={styles.storeSide}>
                    {locals.filter(info => !info.LOCALE?.startsWith("DOCA")).map((props, index)=>{
                        return(
                            <>
                                <div className={styles.storeOrientation} id={index.toString()}>
                                    {route.filter(info => info.LOCALE == props.LOCALE).length > 0 ?
                                        <img src="/routelocaleGreen.svg"/> :
                                    props.Y > route[lastYPosition]?.Y && props.Y < route[route.length - 1]?.Y ?
                                        null :
                                    props.Y > route[0].Y && route[route.length - 1]?.Y >= props.Y ?
                                        <img src="/routeUp.svg"/> :
                                    props.Y > route[route.length - 1]?.Y ?
                                        <img src="/routeDown.svg"/> :
                                        null
                                    }
                                </div>
                            </>
                        )
                    })}
                </div>
                </>:null}
            </div>
        </>
    )
}