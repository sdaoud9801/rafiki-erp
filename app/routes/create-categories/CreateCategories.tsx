import Nav from '~/components/Nav/Nav';
import Style from './CreateCategories.module.css';
import Category from './Category/Category';
import ErrorComponent from '~/components/Error/Error';
import { useState } from 'react';

export async function clientLoader() {
    let res = await fetch('http://localhost:3000/admin/categories', {
        credentials: 'include'
    });
    let loaderData = await res.json();
    return loaderData;
}

type ErrorObject = {
    error: string,
    data: null
}

type ReturnObject = {
    error: null,
    data: {
        categories: any,
        role: 'admin' | 'user'
    }
}

export default function CreateCategories({
    loaderData
}: {
    loaderData: ReturnObject | ErrorObject
}) {
    if (loaderData.error) {
        return (<ErrorComponent message={loaderData.error} />)
    }
    let returnObject = loaderData as ReturnObject;
    let { categories } = returnObject.data;
    let [categoriesAndItems, setCategoriesAndItems] = useState(categories);
    let [categoryName, setCategoryName] = useState('');
    let [error, setError] = useState({
        error: false,
        message: ''
    });
    let [success, setSuccess] = useState(false);
    let [loading, setLoading] = useState(false);
    console.log(categoriesAndItems);
    function validate() {
        let categories = Object.keys(categoriesAndItems);
        categories.forEach((category) => {
            if (category.toLowerCase() == categoryName.toLowerCase()) {
                throw new Error('Category already exists');
            }
        });
        if (categoryName == '') {
            throw new Error('Category is empty');
        } else if (categoryName.length > 200) {
            throw new Error('Length of category cannot be more than 200 characters');
        }
    }
    async function submit(e: React.MouseEvent) {
        setError({
            error: false,
            message: ''
        });
        setLoading(true);
        setSuccess(false);
        e.preventDefault();
        try {
            validate();
            let res = await fetch('/admin/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    category: categoryName
                })
            });
            let statusAndCategory = await res.json();
            console.log('StatusAndCategory', statusAndCategory);
            let { error, data } = statusAndCategory;
            if (!error) {
                setSuccess(true);
                let {category} = data;
                let newCategoriesAndItems = { ...categoriesAndItems };
                newCategoriesAndItems[category] = []
                setCategoriesAndItems(newCategoriesAndItems);
            } else {
                setError({
                    error: true,
                    message: 'error updating datababase'
                });
            }
        } catch (e: any) {
            setError({
                error: true,
                message: e.message
            })
        }
        setLoading(false)
    }
    
    return (
        <>
            <Nav role={returnObject.data.role} />
            <div className={Style.outerContainer}>
                <div className={Style.innerContainer}>
                    <h2 className={Style.pageHeader}>Categories</h2>
                    <div className={Style.createCategoryContainer}>
                        <h3 className={Style.sectionHeader}>Add new category</h3>
                        <span className={Style.categoryLabel}>Category name</span>
                        <input value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} className={Style.inputText} type="text"></input>
                        <button className={Style.createCategoryButton} onClick={submit}>Create category</button>
                        {
                            success ? (
                                <div className={Style.successMessage}>
                                    Category created successfully
                                </div>
                            ) : null}
                        {error.error ? (
                            <div className={Style.errorMessage}>
                                {error.message}
                            </div>
                        ) : null}
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
                    <h3 className={Style.sectionHeader}>Existing categories</h3>
                    {Object.keys(categoriesAndItems).length > 0 ?
                        Object.keys(categoriesAndItems).map((category) => {
                            return <Category categoryName={category} categoryItems={categoriesAndItems[category]} />
                        }) : (
                            <div>No categories added</div>
                        )
                    }
                </div>
            </div>
        </>
    )
}