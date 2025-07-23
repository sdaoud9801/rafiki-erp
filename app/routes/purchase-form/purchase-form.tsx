import { useState } from "react";
import style from "./purchase-form.module.css";
import Supplier from "./supplier/Supplier";
import Item from './item/Item';
import Nav from '../../components/Nav/Nav';
import Error from "~/components/Error/Error";
import {
    handleAddItem,
    deleteItem,
    updateItemCategory,
    updateItemName,
    updateItemQuantity,
    updateItemCost,
    validate
} from "./helper";

type Item = {
    position: number,
    category: string,
    item: string,
    quantity: string,
    cost: string
}

const initialItem = {
    position: 0,
    category: "",
    item: "",
    quantity: "",
    cost: ""
};



export async function clientLoader() {
    const res = await fetch('/user/purchase/formitems', {
        credentials: 'include'
    });
    const returnObject = await res.json();
    return returnObject;
}

export async function HydrateFallBack() {
    return <div>...Loading</div>
}

type ErrorObject = {
    error: string,
    data: null
}

type ReturnObject = {
    error: null,
    data: {
        categories: any,
        items: any,
        suppliers: any,
        role: 'admin' | 'user'
    }
}

export default function PurchaseForm({
    loaderData
}: {
    loaderData: ReturnObject | ErrorObject;
}) {
    if (loaderData.error) {
        return (<Error message={loaderData.error} />)
    }
    let returnObject = loaderData as ReturnObject;
    let { data } = returnObject;
    let categoriesAndItems = data.items;
    let suppliers = data.suppliers;
    let role = data.role;
    const [supplier, setSupplier] = useState("");
    const [items, setItems]: [Item[], any] = useState([initialItem]);
    const [delivery, setDelivery]: [string, any] = useState("0");
    const [error, setError]: [any, any] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    let itemCosts = items.map((item) => {
        return parseInt(item.cost);
    });
    // calculate total for preview
    let total;
    if (items.length > 1) {
        total = itemCosts.reduce((accumulated, currentValue) => {
            return (accumulated + currentValue);
        }) + parseInt(delivery);
    } else {
        total = parseInt(items[0].cost) + parseInt(delivery);
    }
    async function submit(e: React.MouseEvent) {
        e.preventDefault();
        setError(false);
        setLoading(true);
        let postableItems = items.map((item) => {
            let returnItem: any = { ...item };
            delete returnItem.position;
            return returnItem
        })
        console.log(items);
        try {
            validate(
                e,
                supplier,
                delivery,
                items,

            );
            console.log(items);
            let res = await fetch('/user/purchase/create-purchase', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    supplier,
                    delivery,
                    items: postableItems
                })
            });
            let { error, data } = await res.json();
            if (error) {
                setError({
                    error: true,
                    message: error
                })
            } else {
                setSuccess(true);
            }
        } catch (e: any) {
            setError({
                error: true,
                message: e.message
            })
        }
        setLoading(false)
    }
    if(success){
        return (
         <>
                <Nav role={returnObject.data.role} />
                <div id={style.main}>
                    <form className={style.innerContainer}>
                        <h3 className={style.successMessage}>
                            Purchase edited successfully
                        </h3>
                        <div className={style.preview}>
                            <div className={style.successSupplier}>
                                <strong>Supplier: </strong>
                                {supplier}
                            </div>
                            <table>
                                <tr>
                                    <th>Item</th>
                                    <th>Amount</th>
                                    <th>Cost</th>
                                </tr>
                                {
                                    items.map((item) => {
                                        return (
                                            <tr>
                                                <td>{item.item}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.cost}</td>
                                            </tr>
                                        )
                                    })}
                                <tr>
                                    <th></th>
                                    <th>Delivery:</th>
                                    <td>{delivery}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Total:</th>
                                    <td>{total ? total : null}</td>
                                </tr>
                            </table>
                        </div>
                    </form>
                </div>
            </>
        )
    }
    return (
        <>
            <Nav role={role} />
            <div id={style.main}>
                <form action="" style={style}>
                    <div className={style.pageHeader}>
                        Create purchase
                    </div>
                    <Supplier setSupplier={setSupplier} suppliers={suppliers} />
                    <div className={style.items}>
                        <p className={style.sectionHeader}>Items</p>
                        {
                            items.map((item) => {
                                return <Item
                                    position={item.position}
                                    items={items}
                                    categoriesAndItems={categoriesAndItems}
                                    setItems={setItems}
                                    deleteItem={deleteItem}
                                    updateItemCategory={updateItemCategory}
                                    updateItemName={updateItemName}
                                    updateItemQuantity={updateItemQuantity}
                                    updateItemCost={updateItemCost}
                                    key={item.position}
                                />
                            })
                        }
                        <button className={style.addItemButton} onClick={(e) => { handleAddItem(e, items, setItems) }}>Add item</button>
                    </div>
                    <div className={style.delivery}>
                        <label>
                            Delivery cost
                        </label>
                        <input type="number" onChange={(e) => { setDelivery(e.target.value) }} min="0"></input>
                    </div>
                    <div className={style.preview}>
                        <p>Preview</p>
                        <table>
                            <tr>
                                <th>Item</th>
                                <th>Amount</th>
                                <th>Cost</th>
                            </tr>
                            {items.map((item) => {
                                return (
                                    <tr>
                                        <td>{item.item}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.cost}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <th></th>
                                <th>Delivery:</th>
                                <td>{delivery}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>Total:</th>
                                <td>{total ? total : null}</td>
                            </tr>
                        </table>
                    </div>
                    <div className={style.createPurchaseButtonContainer}>
                        <button className={loading ? style.createPurchaseLoading : style.createPurchase} onClick={loading ? ()=>{} : submit}>Create purchase</button>
                    </div>
                    {
                        error.error ?
                            (<div className={style.errorMessageContainer}>
                                <div className={style.errorMessage}>
                                    Error: <br></br> {error.message}
                                </div>
                            </div>) :
                            null
                    }
                    {
                        loading ? (
                            <div className={style.loadingMessageContainer}>
                                <div className={style.loading}>
                                    Loading
                                    <div className={style.loadingSpinner}></div>
                                </div>
                            </div>
                        ) : (
                            null
                        )
                    }
                </form>
            </div>
        </>
    )
}