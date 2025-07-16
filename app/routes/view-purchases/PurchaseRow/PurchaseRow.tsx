import style from './PurchaseRow.module.css';
import { useState } from 'react';

type Purchase = {
    purchase_id: number,
    date: string,
    delivery: number,
    supplier: string,
    approved: boolean,
    items: {
        name: string,
        quantity: number,
        cost: number
    }[]
}

export default function PurchaseRow({ purchase }: { purchase: Purchase }) {
    const [expanded, setExpanded] = useState(false);
    let date = purchase.date.slice(0, 10);
    let total = 0;
    total = total + purchase.delivery;
    purchase.items.forEach((item) => {
        total = total + item.cost
    });
    function toggleExpanded(){
        if(expanded) {
            setExpanded(false)
        } else {
            setExpanded(true)
        }
    }
    return (
        <>
            <tr onClick={toggleExpanded}>
                <td>{date}</td>
                <td>{purchase.purchase_id}</td>
                <td>{total}</td>
                <td className={expanded ? style.downButton : style.upButton}><strong>^</strong></td>
            </tr>
            <tr className={expanded ? style.show : style.hide}>
                <td colSpan={4} className={style.detailsContainer}>
                    <div className={style.supplier}>
                        <strong>Supplier: </strong>
                        {purchase.supplier}
                    </div>
                    <table className={style.details}>
                        <tr>
                            <th className={style.alignLeft}>Item</th>
                            <th>Amount</th>
                            <th>Cost</th>
                        </tr>
                        {
                        purchase.items.map((item) => {
                            return (
                                <tr>
                                    <td className={style.alignLeft}>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td className={style.alignRight}>{item.cost}</td>
                                </tr>
                            )
                        })
                        }
                        <tr>
                            <th></th>
                            <th className={style.alignRight}>Delivery:</th>
                            <td className={style.alignRight}>{purchase.delivery}</td>
                        </tr>
                        <tr>
                            <td className={style.noBottomBorder}></td>
                            <th className={style.noBottomBorder + " " + style.alignRight}>Total:</th>
                            <td className={style.noBottomBorder + " " + style.alignRight}>{total ? total : null}</td>
                        </tr>
                    </table>
                    <div className={style.buttonsContainer}>
                        <a href={`/edit/${purchase.purchase_id}`} className={style.editButton}>Edit</a>
                        <a className={style.deleteButton}>Delete</a>
                    </div>
                </td>
            </tr>
        </>
    )
}