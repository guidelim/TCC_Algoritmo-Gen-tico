import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Redirect() {
    const router = useRouter();

    useEffect(() => {
        if(router.query.token !== undefined){
            setTokenUser();
        }
    }, [router]);

    async function setTokenUser() {
        const currentDate = new Date();
        const expiresDate = new Date(currentDate.getTime() + (8 * 60 * 60 * 1000)).toUTCString();
        
        document.cookie = `token=${router.query.token}; expires=${expiresDate}; path=/;`;

        router.push('/app');
    }

    return (
        <>
        </>
    );
}
