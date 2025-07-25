import { useState } from "react";
import style from './supplier.module.css';

export default function Supplier({ setSupplier, suppliers }: { setSupplier: (param: string) => void, suppliers: string[]}) {
    let [other, setOther] = useState(false);
    function checkIfOther(value: string){
        if(value === "other"){
            setOther(true);
            setSupplier('');
        } else {
            setOther(false);
            setSupplier(value);
        }
    }
    return (
        <div className={style["supplier-section"]} style={style}>
            <label htmlFor="supplier">Supplier</label>
            <select name="supplier" id="supplier" onChange={(e)=>{checkIfOther(e.target.value)}}>
                <option selected disabled>-- Select an option --</option>
                {
                    suppliers.map((supplier)=>{
                        return (<option>{supplier}</option>)
                    })
                }
                <option>Other</option>
            </select>
            { 
                other ? (   
                    <>
                        <label htmlFor="other-supplier">New supplier</label>
                        <input type="text" id="other-supplier" onChange={(e)=>{setSupplier(e.target.value)}}></input>
                    </>
                ) : "" 
            }
        </div>
    )
}