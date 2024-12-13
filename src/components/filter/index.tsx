import styles from './filter.module.scss'
import { useState, useEffect } from "react";

export default function Filter({callback}) {
    const [maxDate, setMaxDate] = useState("");
    const [minDate, setMinDate] = useState("");
    const [filterOn, setFilterOn] = useState(false);
    const [aplied, setAplied] = useState(false);

    const [dateMinSelected, setDateMinSelected] = useState("");
    const [dateMaxSelected, setDateMaxSelected] = useState("");

    useEffect(() => {
        const data = new Date();

        const dateFormated = data.getFullYear() + '-' + ("0"+(data.getMonth()+1)).slice(-2) + '-' + ("0"+data.getDate()).slice(-2);
        setMinDate(dateFormated);
        setMaxDate(dateFormated)
    },[])

    useEffect(() => {
        if(maxDate == '' || minDate == "") return;

        callback({minDate, maxDate})
    },[minDate, maxDate])

    return (
        <>
            <div className={styles.filter}>
                <div className={styles.filterBox}>
                    <button onClick={()=>setFilterOn(filterOn ? false : true)}>Filtrar <img src="/filter.svg"/></button>
                    <div className={styles.detailFilter}>
                        <h1>Filtro Aplicado</h1>
                        <p>{aplied ? dateMinSelected + " - " + dateMaxSelected : minDate + " - " + maxDate}</p>
                    </div>
                    <div className={`${styles.questionBox} ${filterOn ? styles.show : ''}`}>
                        <div className={styles.applyFilter}>
                            <button onClick={()=>{
                                setAplied(true)
                                setMaxDate(dateMaxSelected);
                                setMinDate(dateMinSelected);
                                setFilterOn(false)
                                }}>Aplicar <img src="/done.svg"/></button>
                        </div>
                        {/*<div className={styles.questionFilter}>
                            <p>Placa</p>
                            <input type="text" maxLength={7} value={driverPlate} onChange={(e)=>setDriverPlate(e.target.value.toUpperCase())}/>
                        </div>*/}
                        <span></span>
                        <div className={styles.questionFilter}>
                            <p>Data Mínima</p>
                            <input type="date" onChange={(e)=>{
                                setDateMinSelected(e.target.value)}} max={dateMaxSelected}/>
                        </div>
                        <span></span>
                        <div className={styles.questionFilter}>
                            <p>Data Máxima</p>
                            <input type="date" min={dateMinSelected} onChange={(e)=>{
                                setDateMaxSelected(e.target.value)}}/>
                        </div>
                        <span></span>
                    </div>
                </div>
            </div>
        </>
    )
}