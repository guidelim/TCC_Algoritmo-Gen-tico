import { useEffect, useRef } from 'react';
import styles from './alert.module.scss';

export default function Alerta({ mensagem, tipo, onClose, autoClose }) {
    useEffect(() => {
      let timer;
      if (autoClose) {
        timer = setTimeout(() => {
          handleClose();
        }, autoClose);
      }
      return () => {
        clearTimeout(timer);
      };
    }, [autoClose]);
  
    function handleClose() {
      onClose && onClose();
    }


    return (
      <>
      <div className={styles.boxMaster}>
        <div className={tipo == "sucesso" ? styles.box_sucess : tipo == "warning" ? styles.box_warning : styles.box_error}>
          <img src={tipo == "sucesso" ? "/sucess.svg" : tipo == "warning" ? "/warning.svg" : "/error.svg"}/>
          <span>{mensagem}</span>
          <span className={styles.btn} onClick={()=>handleClose()}>X</span>
        </div>
      </div>
      </>
    );
  }
  
