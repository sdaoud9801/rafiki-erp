import Nav from "~/components/Nav/Nav";
import Style from './ApprovePurchase.module.css';
import UnapprovedPurchase from "./UnapprovedPuchase/UnapprovedPurchase";
import Error from "~/components/Error/Error";

export async function clientLoader() {
    let res = await fetch('http://localhost:3000/admin/unapprovedpurchases', {
        credentials: 'include'
    });
    let loaderData = await res.json();
    return loaderData;
}

export function HydrateFallBack() {
    return <div>...Loading</div>
}

type ReturnObject = {
    error: null,
    data: {
        unapprovedPurchases: {
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
        }[],
        role: 'user' | 'admin'
    }
}

type ErrorObject = {
    error: string,
    data: null
}

export default function PurchaseForm({
    loaderData
}: {
    loaderData: ErrorObject | ReturnObject
    }
) {
    if (loaderData.error) {
        return (
        <Error message={loaderData.error} />
    )
    }
    const returnObject = loaderData as ReturnObject
    const {
        unapprovedPurchases,
        role
    } = returnObject.data;
    return (
        <>
            <Nav role={role} />
            <div className={Style.outerContainer}>
                <div className={Style.innerContainer}>
                    <div className={Style.pageHeader}>
                        Unapproved purchases
                    </div>
                    {
                        unapprovedPurchases.length > 0 ? (
                        unapprovedPurchases.map((unapprovedPurchase) => {
                            return (
                                <UnapprovedPurchase purchase={unapprovedPurchase} />
                            )
                        })
                    ) : (
                        <div>
                            No unapproved purchases
                        </div>
                    )
                    }
                </div>
            </div>
        </>
    )
}