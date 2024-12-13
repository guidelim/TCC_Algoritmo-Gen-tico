import '../styles/global.scss'
import styles from "../styles/app.module.scss"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../components/loader'
import ComponentUsers from '../components/componentuser';

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const [isLoading, setLoading] = useState(false);
  const [componentOn, setComponent] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", (url) => {
      setLoading(true);
    });

    router.events.on("routeChangeComplete", (url) => {
      setLoading(false);
      setComponent(false);
    });

    router.events.on("routeChangeError", (url) => {
      setLoading(false);
    });
  }, [router])

  const mapRoutes = {
    '/app': 'Roteirizador',
    '/app/uploadSapFile': 'Base SAP',
    '/app/routings/[id]': `Rota - ${router?.query?.id}`,
    '/app/routings/myroutes': 'Minhas rotas',
    '/app/routings/allroutes': 'Todas as rotas',
    '/app/export/routeinfos': 'Informações da rotas',
    '/app/export/routing': 'Roteirização'
  }

  return (
    <div className={styles.wrapper}>
      <main>
        {isLoading ? <Loader /> :
          mapRoutes[router.pathname] == undefined ?
            <>
              <Component {...pageProps} />
            </> :
            <>
              <div className={styles.content}>
                  {componentOn ?
                    <div className={styles.boxPropsUser}>
                      <ComponentUsers visible={componentOn} callback={() => setComponent(componentOn ? false : true)} />
                    </div> :
                    <div className={styles.reduxBoxUser} onClick={() => setComponent(componentOn ? false : true)}>
                      <div className={styles.boxImg}>
                        <img src="/arrowgo.svg" />
                      </div>
                    </div>}
                  <div className={`${styles.container} ${componentOn ? styles.show : ""}`}>
                    <div className={styles.barGradient}>
                      <h1>{mapRoutes[router.pathname]}</h1>
                    </div>
                    <div className={styles.component}>
                      <Component {...pageProps} />
                    </div>
                  </div>
              </div>
            </>
        }
      </main>
    </div>
  )
}

export default MyApp
