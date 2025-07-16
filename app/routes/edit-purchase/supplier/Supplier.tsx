import { useState } from "react";
import style from './supplier.module.css';

export default function Supplier({ setSupplier, suppliers, initialSupplier }: { setSupplier: (param: string) => void, suppliers: string[], initialSupplier: string}) {
    let [other, setOther] = useState(false);
    let [innerSupplier, setInnerSupplier] = useState(initialSupplier);
    function updateSupplier(value: string){
        if(value === "other"){
            setOther(true);
            setInnerSupplier('other');
            setSupplier('');
        } else {
            setOther(false);
            setInnerSupplier(value);
            setSupplier(value);
        }
    }
    return (
        <div className={style["supplier-section"]} style={style}>
            <label htmlFor="supplier">Supplier</label>
            <select name="supplier" id="supplier" value={innerSupplier} onChange={(e)=>{updateSupplier(e.target.value)}}>
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