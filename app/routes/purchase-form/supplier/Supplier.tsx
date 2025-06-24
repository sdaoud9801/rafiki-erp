import { useState } from "react";
import style from './supplier.module.css';

export default function Supplier({ setSupplier }: { setSupplier: (param: string) => void }) {
    let [other, setOther] = useState(false);
    function checkIfOther(value: string){
        if(value === "other"){
            setOther(true); 
        } else {
            setOther(false);
            setSupplier(value);
        }
    }
    return (
        <div className={style["supplier-section"]} style={style}>
            <label htmlFor="supplier">Supplier</label>
            <select name="supplier" id="supplier" onChange={(e)=>{checkIfOther(e.target.value)}}>
                <option value="volvo">Option 1</option>
                <option value="car">Option 2</option>
                <option value="other">Other</option>
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