import generateRandomNonce from './nonce';


export default async function pageChanger(page) {
    const res = await fetch('/changePage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            page,
            'Authorization': `Bearer ${await generateRandomNonce()}`,
        }
    })

    return res.status;
}