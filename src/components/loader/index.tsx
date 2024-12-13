import styles from './styles.module.scss';

function Loader () {
    return (
        <>
            <div className={styles.loaded}>
                <span></span>
            </div>
        </>
    )
}

export default Loader;