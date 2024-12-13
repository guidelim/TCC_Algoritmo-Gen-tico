import { useState } from 'react';
import styles from './ucandstore.module.scss';
import DecisionAlert from '../alertDecision';

export default function UcAndStore({informations, deleteOn, deleteItem}) {
    const [decisionOn, setDecisionOn] = useState(false);
    const [indexSelected, setIndexSelected] = useState(-1);

    function handleClose(){
        setDecisionOn(false);
    }

    return (
        <>
            {decisionOn ? 
                <DecisionAlert 
                    mensagem={`Deseja remover item ${informations[indexSelected].uc} da ${informations[indexSelected].store}?`} 
                    onClose={handleClose}
                    callback={() => {
                        setDecisionOn(false);
                        deleteItem(indexSelected);
                    }}
                />:null}
            <div className={styles.tableStores}>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Local</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {informations.map((props,index)=>{
                            return(
                                <tr id={index.toString()}>
                                    <th>{props.uc}</th>
                                    <th>{props.loc}</th>
                                    {deleteOn ? <th><img onClick={()=>{
                                        setIndexSelected(index)
                                        setDecisionOn(true);
                                    }} src="/delete.svg"/></th>:null}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}