import Select from "react-select";
import styles from './selector.module.scss';
import { useEffect, useState } from "react";

export default function Selector({value, questionName, callback, clear}){
    const [selectedValue, setSelectedValue] = useState(null)

    useEffect(()=>{
        if(clear == ''){
            setSelectedValue(null);
        }
    },[clear])

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '30px',
            height: '30px',
            borderColor: state.isFocused ? '#f1f1f1' : '#f1f1f1', 
            boxShadow: "0 0 1px #000",
            '&:hover': {
              borderColor: '#f1f1f1',
              boxShadow: "0 0 1px #000",
            },
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: '30px',
            padding: '0 6px',
        }),
        menu: (provided, state) => ({
            ...provided,
            width: "100%",
            height: "2rem",
            minHeight: '0',
            margin: '0',
        }),
        input: (provided, state) => ({
            ...provided,
            '& input': { 
                minWidth: '200px',
            },
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '30px',
        }),
        option: (provided, state) => ({
            ...provided,
            color: "#000",
            backgroundColor: state.isFocused ? '#fff' : '#f1f1f1',
            '&:hover': {
                backgroundColor: '#fff',
            },
        }),
    };

    return (
        <>
            <div className={styles.question}>
                <div className={styles.questionTitle}>
                    <h1><p>*</p>{questionName}</h1>
                </div>
                <Select
                    onChange={(e) => {
                        setSelectedValue(e);
                        callback(e);
                    }}
                    options={value}
                    value={selectedValue}
                    placeholder={""}
                    isClearable={true}
                    noOptionsMessage={()=>`${questionName} não encontrado(a).`}
                    styles={customStyles}/>
            </div>
        </>
    )
}