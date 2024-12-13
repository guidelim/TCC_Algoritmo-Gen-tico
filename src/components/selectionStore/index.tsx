import Selector from '../selector';
import styles from './style.module.scss';
import { useEffect, useRef, useState } from 'react';

export default function SelectionStore({mensagem, stores, onClose, callback}) {
  function handleClose() {
    onClose && onClose();
  }

  const [msgError, setMsgError] = useState('');
  const [store, setStore] = useState({
    store: '',
    x: '',
    y: '',
    eixo: '',
    loc: ''
  });
  
  return (
    <>
      <div className={styles.boxMasterDecision}>
        <div className={styles.boxDecision}>
          <div className={styles.boxHeader}>
            <img src="/store.svg"/>
            <h1>Selecione o Local</h1>
            <span className={styles.btnClose} onClick={()=>handleClose()}>X</span>
          </div>
          <div className={styles.boxWarning}>
            <span>{mensagem}</span>
            <div className={styles.boxSelector}>
              <Selector questionName={"Local"} value={stores.map(props => {
                return{
                  value: props.LOCALE?.trim(),
                  label: props.LOC?.toUpperCase(),
                  x: props.X,
                  y: props.Y,
                  eixo: props.EIXO,
                  loc: props.LOC
                }
              })} clear={false} callback={(e)=>{
                if(e !== null) {
                  setStore({
                    store: e.value,
                    x: e.x,
                    y: e.y,
                    eixo: e.eixo,
                    loc: e.loc
                  });
                }
              }}/>
              <p>{msgError}</p>
            </div>
            <div className={styles.boxButtons}>
              <button onClick={()=>{
                  if(store.store == "" || store.store == undefined){
                    setMsgError('Selecione o local.');
                  } else {
                    callback(store);
                  }
                }}>Confirmar</button>
              <button onClick={()=>handleClose()}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}