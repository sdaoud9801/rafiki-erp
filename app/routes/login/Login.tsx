import { useState } from 'react';
import Style from './Login.module.css';
import Nav from '~/components/Nav/Nav';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState ({
        error: false,
        message: ''
    });
    const [loading, setLoading] = useState(false);
    async function logIn(){
        setError({
            error: false,
            message: ''
        })
        setLoading(true);
        let res = await fetch('/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        let response = await res.json();
        let {status} = response;
        if(status == true){
            window.location.replace('/view-purchases');
        }
        else {
            setError({
                error: true,
                message: 'Incorrect credentials'
            })
        }
        setLoading(false);
    }

    return (
        <>
            <Nav role={undefined} />
            <div className={Style.outerContainer}>
                <div className={Style.innerContainer}>
                    <div className={Style.header}>
                        Login
                    </div>
                    <div className={Style.formContainer}>
                        <span className={Style.label}>Username</span>
                        <input type="text" className={Style.textInput} value={username} onChange={(e)=>{setUsername(e.target.value)}}></input>
                        <span className={Style.label}>Password</span>
                        <input type="password" className={Style.passwordInput} value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
                        <button className={loading ? Style.loginButtonLoading : Style.loginButton} onClick={loading ? ()=>{} : logIn}>
                            Login
                        </button>
                        {
                            error.error ? (
                                <div className={Style.errorMessage}>
                                    {error.message}
                                </div>
                            ) : (
                                null
                            )
                        }
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
                </div>
            </div>
        </>
    )
}