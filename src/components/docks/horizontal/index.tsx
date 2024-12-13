import { useEffect } from 'react';
import styles from './hori.module.scss';

export default function DocksHorizontal({docks}) {
    
    return (
        <>
            <div className={styles.docksContent}>
                {docks.map((props, index) => {
                    return (
                        <>
                            <div className={styles.dock} id={index.toString()}>
                                <h1>{props.LOCALE}</h1>
                            </div>
                        </>
                    )
                })}
            </div>
        </>
    )
}