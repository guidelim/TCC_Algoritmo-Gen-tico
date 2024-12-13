import { useEffect } from 'react';
import styles from './hori.module.scss';

export default function StoresHorizontal({stores}) {

    return (
        <>
            <div className={styles.storesContent}>
                {stores.map((props, index) => {
                    return (
                        <>
                            <div className={styles.stores} id={index.toString()}>
                                <h1>{props.LOCALE}</h1>
                            </div>
                        </>
                    )
                })}
            </div>
        </>
    )
}