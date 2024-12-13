import styles from './loading.module.scss'

export default function Loading({message}) {

    return (
        <>
            <div className={styles.content}>
                <div className={styles.container}>   
                    <div className={styles.boxLoader}>
                        <div className={styles.loader}>
                        </div>
                        <h1>{message}</h1>
                    </div>
                </div>
            </div>
        </>
    )
}