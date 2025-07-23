import Style from './UnapprovedPurchase.module.css';
import { useState } from 'react';

export default function UnapprovedPurchase({ purchase }: {
    purchase: {
        approved: boolean,
        date: string,
        delivery: number,
        items: {
            name: string,
            quantity: number,
            cost: number
        }[],
        purchase_id: number,
        supplier: string
    }
}) {
    const [approved, setApproved] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    let itemCosts = purchase.items.map((item) => {
        return item.cost;
    })
    let total = itemCosts.reduce((previousValue, currentValue) => {
        return previousValue + currentValue
    }) + purchase.delivery;
    console.log(total);
    async function approvePurchase() {
        setError(false);
        setLoading(true);
        let res = await fetch('/admin/approvepurchase', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                purchase_id: purchase.purchase_id
            })
        });
        let returnObject = await res.json();
        console.log(returnObject)
        let {error} = returnObject;
        if (!error) {
            setApproved(true);
        } else {
            setApproved(false);
            setError(true);
        }
        setTimeout(()=>{
            setLoading(false)
        }, 2000)
    }
    if (approved) {
        return (
            <div className={Style.purchaseContainer}>
                <div className={Style.successMessage}>
                    Purchase approved successfully
                </div>
            </div>
        )
    } else {
        return (
            <div className={Style.purchaseContainer}>
                <strong>Date: </strong>
                {purchase.date.slice(0, 10)}
                <br></br>
                <strong>Purchase ID: </strong>
                {purchase.purchase_id}
                <br></br>
                <strong>Supplier: </strong>
                {purchase.supplier}
                <table className={Style.purchaseTable}>
                    <thead>
                        <tr>
                            <th className={Style.alignLeft}>
                                Item
                            </th>
                            <th>
                                Amount
                            </th>
                            <th>
                                Cost
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            purchase.items.map((item) => {
                                return (
                                    <tr>
                                        <td>
                                            {item.name}
                                        </td>
                                        <td className={Style.alignCenter}>
                                            {item.quantity}
                                        </td>
                                        <td className={Style.alignRight}>
                                            {item.cost}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td></td>
                            <td className={Style.alignRight}>
                                <strong>Delivery:</strong>
                            </td>
                            <td className={Style.alignRight}>{purchase.delivery}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className={Style.alignRight}>
                                <strong>Total:</strong>
                            </td>
                            <td className={Style.alignRight}>{total}</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <button className={loading ? Style.approveButtonLoading : Style.approveButton} onClick={loading ? ()=>{} : approvePurchase}>Approve</button>
                </div>
                {
                        loading ? (
                                <div className={Style.loading}>
                                    Loading
                                    <div className={Style.loadingSpinner}></div>
                                </div>
                        ) : (
                            null
                        )
                    }
            </div>

        )
    }

}