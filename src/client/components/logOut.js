import { Redirect } from 'react-router-dom';

const logOut = async () => {
    console.log('oui');
    await fetch('/logout', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: '{}',
    })
    .then(() => {
        <Redirect to ="/" />
        window.location.reload();
    })
    .catch((err) => {
        <Redirect to ="/" />
        window.location.reload();
        console.log(err);
    })
}

export default logOut;
