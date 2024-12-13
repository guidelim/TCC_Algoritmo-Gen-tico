import { useEffect } from 'react';
import styles from './ver.module.scss';

export default function DocksVertical({docks}) {

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