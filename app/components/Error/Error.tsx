import Nav from "../Nav/Nav";
import errorImage from './error_icon.svg';
import Style from './Error.module.css';

export default function Error({ message }: { message: string }) {
    if (message === 'no JWT') {
        return (
            <>  
                <Nav role={undefined} />
                <div className={Style.outerContainer}>
                    <div className={Style.errorContainer}>
                        <img src={errorImage} className={Style.errorImage} />
                        <div className={Style.errorText}>
                            <strong>Error: </strong>
                            The page you are trying to access requires you to log in.
                            <a href='/'>Log in</a>
                        </div>
                    </div>
                </div>
            </>
        )
    } else if (message === 'no access'){
        return (
            <>
                <Nav role={'user'} />
                <div className={Style.outerContainer}>
                    <div className={Style.errorContainer}>
                        <img src={errorImage} className={Style.errorImage} />
                        <div className={Style.errorText}>
                            <strong>Error: </strong>
                            You do not have access to this page. Please go back.
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
        <>
            <Nav role={undefined} />
            <div className={Style.errorContainer}>
                <img src={errorImage} className={Style.errorImage} />
                <div className={Style.errorText}>
                    <strong>Error: </strong>
                    {message}
                    <br></br>
                    Please reload the page. If the error persists, please screenshot and send to +201125525520
                </div>
            </div>
        </>
        )
    }
    
    
}