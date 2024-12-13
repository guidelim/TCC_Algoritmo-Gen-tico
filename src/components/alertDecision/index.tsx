import styles from './style.module.scss';
import { useEffect, useRef } from 'react';

export default function DecisionAlert({mensagem, onClose, callback}) {
  function handleClose() {
    onClose && onClose();
  }
  
  return (
    <>
      <div className={styles.boxMasterDecision}>
        <div className={styles.boxDecision}>
          <div className={styles.boxHeader}>
            <img src="/warning.svg"/>
            <h1>Conclua sua ação</h1>
            <span className={styles.btnClose} onClick={()=>handleClose()}>X</span>
          </div>
          <div className={styles.boxWarning}>
            <span>{mensagem}</span>
            <div className={styles.boxButtons}>
              <button onClick={()=>callback(true)}>Confirmar</button>
              <button onClick={()=>handleClose()}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}