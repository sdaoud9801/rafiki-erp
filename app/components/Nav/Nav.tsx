import style from './Nav.module.css'
import menuIcon from './menu_icon.svg';
import { useState } from 'react';

export default function Nav({role}: {role: 'admin' | 'user' | undefined}){
    let [expanded, setExpanded] = useState(false);
    function toggleExpanded(){
        if(expanded){
            setExpanded(false);
        } else {
            setExpanded(true);
        }
    }
    function logOut(){
        document.cookie = 'auth=';
        window.location.replace('http://localhost:5173/');
    }
    if(role == 'admin') {
        return(
            <nav>
                <div className={style.mainContainer}>
                    <span>Rafiki Operations</span>
                    <img src={menuIcon} className={style.menuIcon} onClick={toggleExpanded}></img>  
                </div>
                <div className={expanded ? style.links : style.hide}>
                    <hr></hr>
                    <a href="/view-purchases">View purchases</a>
                    <hr></hr>
                    <a href='/purchase-form'>Create purchase</a>
                    <hr></hr>
                    <a href='/approval'>Unapproved purchases</a>
                    <hr></hr>
                    <a href='/create-category'>View/add categories</a>
                    <hr></hr>
                    <a onClick={logOut}>Log out</a>
                </div>
            </nav>
        )
    } else if (role === 'user'){
    return (
            <nav>
                <div className={style.mainContainer}>
                    <span>Rafiki Operations</span>
                    <img src={menuIcon} className={style.menuIcon} onClick={toggleExpanded}></img>  
                </div>
                <div className={expanded ? style.links : style.hide}>
                    <hr></hr>
                    <a href="/view-purchases">View purchases</a>
                    <hr></hr>
                    <a href='/purchase-form'>Create purchase</a>
                    <hr></hr>
                    <a href='/'>Log out</a>
                </div>
            </nav>
            )
    } else {
        return (
            <nav>
                <div className={style.mainContainer}>
                    <span>Rafiki Operations</span>
                </div>
            </nav>
        )
    }
}