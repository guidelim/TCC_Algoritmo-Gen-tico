import { useEffect, useState } from 'react';
import styles from './road.module.scss';

export default function RoadVerticalJ({locales, route, allLocales}){
    const [yMax, setYMax] = useState(-1);
    const [lastYPosition, setLastYPosition] = useState(-1);

    useEffect(() => {
        setArrowFromRoute();
    },[route])

    function setArrowFromRoute() {
        let routesLen = route.length;
        let maxY = 0;

        for(let i = 1; i < routesLen; i++) {
            console.log(route[i]);
            if(route[i].Y > maxY) {
                maxY = route[i].Y;
                setLastYPosition(i);
            }
        }

        setYMax(maxY);
    }

    /*useEffect(()=>{
        console.log(lastYPosition);
        console.log(route[lastYPosition]);
    },[lastYPosition])*/

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
                    locales.filter(info => !info.LOCALE?.startsWith("DOCA")).map((props, index)=>{
                        return(
                            <>
                                <div className={styles.storeOrientation} id={index.toString()}>
                                    {
                                    locales.filter(info => info.LOCALE == route[1].LOCALE).length == 0 ?
                                    null:
                                    props.LOCALE == route[lastYPosition]?.LOCALE ?
                                        <img src="/routelocaleGreen.svg"/> :
                                    props.Y > route[lastYPosition]?.Y ?
                                        null :
                                    (props.Y - 8) > route[0].Y && route[lastYPosition]?.Y >= props.Y ?
                                        <img src="/routeUp.svg"/> :
                                    (props.Y - 8) < route[0].Y && route[lastYPosition]?.Y == route[0].Y ?
                                        <img src="/routeDown.svg"/> :
                                        null
                                    }
                                </div>
                            </>
                        )
                    })}
                </div>
                {route.filter(info => info.EIXO == "VERTICAL").length > 0?<>
                <div className={styles.storeSide}>
                    {locales.filter(info => !info.LOCALE?.startsWith("DOCA")).map((props, index)=>{
                        return(
                            <>
                                <div className={styles.storeOrientation} id={index.toString()}>
                                    {route.filter(info => info.LOCALE == props.LOCALE).length > 0 ?
                                        <img src="/routelocaleGreen.svg"/> :
                                    props.Y > route[lastYPosition]?.Y ?
                                        null :
                                    (props.Y - 8) > route[0].Y && route[lastYPosition]?.Y >= props.Y ?
                                        <img src="/routeUp.svg"/> :
                                    (props.Y - 8) < route[0].Y ?
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