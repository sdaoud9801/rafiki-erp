export function authCheck(returnObject){
    console.log(returnObject);
    if(returnObject.status == 'error') {
        console.log('ran');
        if(returnObject.error === 'no access'){
            window.location.replace('http://localhost:5173/');
        } else if (returnObject.error === 'no JWT'){
            console.log('ran')
            window.location.replace('http://localhost:5173/');
        }
    }
}