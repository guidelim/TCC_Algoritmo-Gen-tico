import Selector from '../selector';
import styles from './style.module.scss';
import { useEffect, useState } from 'react';

export default function SelectionDock({stores, onClose, callback}) {
  function handleClose() {
    onClose && onClose();
  }

  const [msgError, setMsgError] = useState('');
  const [doca, setDoca] = useState({
    store: '',
    x: '',
    y: '',
    eixo: ''
  });

  return (
    <>
      <div className={styles.boxMasterDecision}>
        <div className={styles.boxDecision}>
          <div className={styles.boxHeader}>
            <img src="/store.svg"/>
            <h1>Selecione a local de saída</h1>
            <span className={styles.btnClose} onClick={()=>handleClose()}>X</span>
          </div>
          <div className={styles.boxWarning}>
            <div className={styles.boxSelector}>
              <Selector questionName={"Posição"} value={stores.map(props => {
                return{
                  value: props.LOCALE,
                  label: props.LOCALE.toUpperCase(),
                  x: props.X,
                  y: props.Y,
                  eixo: props.EIXO
                }
              })} clear={false} callback={(e)=>{
                if(e !== null) {
                  setDoca({
                    store: e.value,
                    x: e.x,
                    y: e.y,
                    eixo: e.eixo
                  });
                }
              }}/>
              <p>{msgError}</p>
            </div>
            <div className={styles.boxButtons}>
              <button onClick={()=>{
                  if(doca.store == ""){
                    setMsgError('Selecione o local de saída.');
                  } else {
                    callback(doca);
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