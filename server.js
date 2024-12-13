const { createServer } = require('http');
const { parse } = require('url');
const { NewRoutings } = require('./IA.js');
const oracle = require('oracledb');
var con;
const next = require('next');
const PORT = 14000;
// const HOSTNAME='conferenciaxd.systempe.com.br';
// const dev = false
const HOSTNAME='localhost';
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev, hostname: HOSTNAME, port: PORT });
const handle = app.getRequestHandler();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'credentials.env') });
const jwt = require("jsonwebtoken");

async function getUserToken(token){
    const tk = await con.execute(`SELECT USRTK FROM LR_USERS_SESSION WHERE TOKEN='${token}'`);
    return tk.rows[0]?.USRTK;
}

const pathsHandler = {
    'infouser': async (req, res, cookie) => {
        try {
            await con.execute(`SELECT 
                        U.USRNAME,
                        SA.CONFE_NVL AS NVLACCESS,
                        U.USRTK 
                    FROM LR_USERS U
                    LEFT JOIN LR_USERS_SYSTEM_ACCESS SA ON U.USRTK=SA.USRTK
                    WHERE U.USRTK='${cookie}'`,[],async (err, result) => {
                if(err) throw err
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.end(JSON.stringify(result.rows));
            })
        } catch (err) {
            console.log('(infouser) ' + err);
        }
    },
    'changePage' : async(req, res, cookie) => {
        try {
            await con.execute("INSERT INTO LR_LOGS(TYPE,USRTK,ACTION,DATELOG) VALUES ('CHANGEPAGE',:0,:1,SYSDATE)",[cookie ?? "Redirecionamento",req.headers.page], {autoCommit: true}, async (err, result) => {
                if (err) throw err

                res.statusCode = 200;
                res.end();
            })
        } catch (err) {
            console.log('(changePage) ' + err);
        }
    },
    'uploadSapFile': async (req, res, cookie) => {
        let data = Buffer.alloc(0)
        req.on('data', (frame) => {
            data = Buffer.concat([data, frame])
        })

        req.on('end', async () => {
            try {
                data = JSON.parse(data);

                for (const props of data) {
                    if(props.UC !== undefined && props['Nome Recebedor'] !== undefined){
                        const checkLojaUc = await con.execute(`SELECT LOJA FROM LR_CR_8011 WHERE UC='${props.UC}' AND LOJA='${props['Nome Recebedor']}'`);
                        if(checkLojaUc.rows.length == 0){
                            await con.execute(`INSERT INTO LR_CR_8011(
                                UC, LOJA, IMPORTED_AT
                            ) VALUES (
                                TRIM('${props.UC}'),
                                TRIM('${props['Nome Recebedor']}'),
                                SYSDATE
                            )`,[], {autoCommit: true});
                        }
                    }
                }

                res.statusCode = 200;
                res.end();
            } catch (err) {
                console.log('(uploadSapFile) ' + err);
                res.statusCode = 403;
                res.end();
            }
        })
    },
    'getStoresAndLocations': async (req, res, cookie) => {
        try {
            await con.execute(`
                SELECT 
                    LOCALE, 
                    X, 
                    Y,
                    (CASE WHEN 
                        LOCALE NOT LIKE '%POS%'
                        THEN 'L'
                    ELSE 'D' END) AS LD,
                    EIXO,
                    BLOCO,
                    LOCALE AS LOC
                FROM LR_ANCHIETA_LOCALES
                ORDER BY X,Y DESC`,[],(err, result) => {
                if(err) throw err
            
                res.statusCode = 200;
                res.setHeader("Content-Type",'application/json');
                res.end(JSON.stringify(result.rows));
            })
        } catch (err) {
            console.log("(getStoresAndLocations) " + err);
        }
    },
    'checkAndGetUCStore': async (req, res, cookie) => {
        try {
            const UC = req.headers.uc;

            await con.execute(`
                SELECT 
                    SAP.UC, 
                    SAP.LOJA,
                    L.X,
                    L.Y,
                    L.EIXO,
                    L.CODESTORE || ' - ' || L.LOCALE AS LOC
                FROM LR_CR_8011 SAP
                LEFT JOIN LR_ANCHIETA_LOCALES L ON L.LOCALE=SAP.LOJA
                WHERE TRIM(SAP.UC)='${UC}'`,[], (err, result) => {
                    if(err) throw err

                    res.statusCode = 200;
                    res.setHeader("Content-Type",'application/json');

                    if(result.rows.length == 0) {
                        res.end(JSON.stringify({exist: false}));
                    } else {
                        res.end(JSON.stringify({exist: true, props: result.rows}));
                    }
                })
        } catch (err) {
            console.log('(checkAndGetUCStore) ' + err);
        }
    },
    'createNewRoute': async (req, res, cookie) => {
        let data = Buffer.alloc(0)
        req.on('data', (frame) => {
            data = Buffer.concat([data, frame])
        })

        req.on('end', async () => {
            try {
                data = JSON.parse(data);

                const docas = data.doca;
                const rotas = data.routes;

                let routePolished = [];

                rotas.map((data) => {
                    var check = 0;
                    check = routePolished.filter(info => info.store == data.store).length;
                    
                    if(check == 0){
                        routePolished.push(data);
                    }
                });
            
                const route = new NewRoutings(routePolished,docas);

                let routeInsert = await con.execute(`INSERT INTO LR_CR_ROUTES(IDROUTE, ROUTE, METERS, UCINROUTE, STORES, CREATE_BY, CREATE_AT, ROUTE_INIT_AT)
                    SELECT 
                        COALESCE(MAX(IDROUTE),0)+1,
                        SUBSTR('CR' || LPAD(TO_CHAR(COALESCE(MAX(IDROUTE), 0) + 1), 5, '0'), 1, 7),
                        ${route.distanceRoute},
                        ${rotas.length},
                        ${routePolished.length},
                        '${cookie}',
                        SYSDATE,
                        SYSDATE
                    FROM LR_CR_ROUTES`,[], {autoCommit: true})
                    
                let routeCode = await con.execute(`SELECT ROUTE FROM LR_CR_ROUTES WHERE ROWID='${routeInsert.lastRowid}'`,[]);
                routeCode = routeCode.rows[0]?.ROUTE;

                for(let i = 0; i < route.bestRoute.length; i++){
                    let store = route.routesWithDockIncluse[route.bestRoute[i]].store;

                    const checkIfExistStoreToLaunch = rotas.filter(info => info.store == store);

                    if(checkIfExistStoreToLaunch.length > 0) {
                        for(const props of checkIfExistStoreToLaunch) {
                            await con.execute(`INSERT INTO LR_CR_ROUTES_LOCALES(ROUTE, ORDERLOCALE, LOCALE, UC) 
                            VALUES(
                                '${routeCode}',
                                '${i+1}',
                                '${props.store}',
                                '${props.uc}'
                            )`,[],{autoCommit: true});
                        }
                    } else {
                        await con.execute(`INSERT INTO LR_CR_ROUTES_LOCALES(ROUTE, ORDERLOCALE, LOCALE) 
                        VALUES(
                            '${routeCode}',
                            '${i+1}',
                            '${store}'
                        )`,[],{autoCommit: true});
                    }
                }

                res.statusCode = 200;
                res.setHeader("Content-Type",'application/json');
                res.end(JSON.stringify({code: routeCode}));
            } catch (err) {
                console.log('(createNewRoute) ' + err);
                res.statusCode = 403;
                res.end();
            }
        })
    },
    'getRoutesProps': async (req, res, cookie) => {
        try {
            const dmin = req.headers.dmin;
            const dmax = req.headers.dmax;

            await con.execute(`
            SELECT
                ROUTE,
                METERS,
                UCINROUTE,
                CREATE_BY,
                STORES,
                TO_CHAR(CREATE_AT, 'DD/MM/YYYY HH24:MI') AS CREATE_AT,
                TO_CHAR(ROUTE_INIT_AT, 'DD/MM/YYYY HH24:MI') AS INIT_AT,
                TO_CHAR(ROUTE_FINISH_AT, 'DD/MM/YYYY HH24:MI') AS FINISH_AT
            FROM LR_CR_ROUTES
            WHERE 
                TO_CHAR(CREATE_AT, 'YYYY-MM-DD')>='${dmin}'
                AND TO_CHAR(CREATE_AT, 'YYYY-MM-DD')<='${dmax}'
            ORDER BY CREATE_AT DESC`, [], (err, result) => {
                if(err) throw err

                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.end(JSON.stringify(result.rows));
            })
        } catch (err) {
            console.log('(getRoutesProps) ' + err);
        }
    },
    'getMyRoutesProps': async (req, res, cookie) => {
        try {
            const dmin = req.headers.dmin;
            const dmax = req.headers.dmax;

            await con.execute(`
            SELECT
                ROUTE,
                METERS,
                UCINROUTE,
                CREATE_BY,
                STORES,
                TO_CHAR(CREATE_AT, 'DD/MM/YYYY HH24:MI') AS CREATE_AT,
                TO_CHAR(ROUTE_INIT_AT, 'DD/MM/YYYY HH24:MI') AS INIT_AT,
                TO_CHAR(ROUTE_FINISH_AT, 'DD/MM/YYYY HH24:MI') AS FINISH_AT
            FROM LR_CR_ROUTES
            WHERE 
                TO_CHAR(CREATE_AT, 'YYYY-MM-DD')>='${dmin}'
                AND TO_CHAR(CREATE_AT, 'YYYY-MM-DD')<='${dmax}'
                AND CREATE_BY='${cookie}'
            ORDER BY CREATE_AT DESC`, [], (err, result) => {
                if(err) throw err

                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.end(JSON.stringify(result.rows));
            })
        } catch (err) {
            console.log('(getMyRoutesProps) ' + err);
        }
    },
    'getRouteInformations': async (req, res, cookie) => {
        try {
            const routeID = req.headers.id;

            await con.execute(`
            SELECT
                RL.ORDERLOCALE,
                RL.LOCALE,
                RL.UC,
                TO_CHAR(RL.LOCALE_AT, 'DD/MM/YYYY HH24:MI:SS') AS LOCALE_AT,
                L.EIXO,
                L.BLOCO,
                L.X,
                L.Y,
                L.CODESTORE || ' - ' || L.LOCALE AS LOC
            FROM LR_CR_ROUTES_LOCALES RL
            LEFT JOIN LR_ANCHIETA_LOCALES L ON L.LOCALE=RL.LOCALE
            WHERE RL.ROUTE='${routeID}'
            ORDER BY 1 ASC 
            `,[], (err, result) => {
                if(err) throw err

                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.end(JSON.stringify(result.rows));
            })
        } catch (err) {
            console.log('(getRouteInformations) ' + err);
        }
    },
    'registerStayInStore': async (req, res, cookie) =>{
        try {
            const id = req.headers.id;
            const orderlocale = req.headers.position;

            await con.execute(`UPDATE LR_CR_ROUTES_LOCALES SET LOCALE_AT=SYSDATE
            WHERE ROUTE='${id}' AND ORDERLOCALE='${orderlocale}'`,[],{autoCommit: true});

            res.statusCode = 200;
            res.end();
        } catch (err) {
            console.log('(registerStayInStore) ' + err);
        }
    },
    'checkIfRouteFinished': async (req, res, cookie) => {
        try {
            const id = req.headers.id;

            await con.execute(`UPDATE LR_CR_ROUTES SET 
            ROUTE_FINISH_AT=SYSDATE 
            WHERE ROUTE='${id}' AND ROUTE_FINISH_AT IS NULL`,[],{autoCommit: true});

            res.statusCode = 200;
            res.end();
        } catch (err) {
            console.log("(checkIfRouteFinished) " + err);
        }
    }
}



async function checkSessionUser(req, res) {
    const authorization = req.headers?.authorization?.split(' ')[1]; //Obtenção do token

    if(authorization !== undefined) { //Se diferente de undefined valida o token
        try {
            const secretKey = process.env.SHARED_SECRET; // Chave secreta
            const decoded = await jwt.verify(authorization, secretKey);
            //Validação do token recebido, através de uma chave secreta compartilhada entre FrontEnd e BackEnd
            return true
        } catch (error) {
            return false
        }
    } else { // Sem token, requisição recusada
        return false
    }
}


const ignorePaths = ['app','login','recover','_next','__next','_buildManifest.js','_app','_ssg', 'redirect'];
const ignoreExtensions = ['ico','scss', 'png', 'svg'];

// [---] App Initialization [---]
app.prepare().then(() => {
    const httpserver = createServer(async (req, res) => {
        //console.log("[*] New Request");
        //console.log(req.method);
        //console.log(req.url);

        if(con == undefined) return;
        const parsedUrl = parse(req.url, true);
        let { pathname, query } = parsedUrl;
        pathname = pathname.split('/');
        pathname.splice(0, 1);
        const extensionFile = pathname[0].split('.')[1];

        const validationSession = await checkSessionUser(req);
        const checkIgnoreExt = ignoreExtensions.indexOf(extensionFile) !== -1;
        const checkIgnorePath = ignorePaths.indexOf(pathname[0]) !== -1 || pathname[0].startsWith('_next') || pathname[0].startsWith('_app') || pathname[0].startsWith('_ssg');

        /*console.log(pathname);
        console.log('Session: ' + validationSession);
        console.log('Ext: ' + checkIgnoreExt);
        console.log('Path: ' + checkIgnorePath);   
        console.log('--------------------------');*/

        if(validationSession || checkIgnoreExt || checkIgnorePath) {
            let getCookies = req.headers.cookie?.split(";");
            let cookies = [];
            let user = '';
            let type = '';
            let token = '';

            if(getCookies) {
                getCookies.forEach(element => {
                    const [name, value] = element.split("=");
                
                    if(name.trim() == "token") {
                        token = value.trim().toLowerCase();
                    }
                });
            }

            user = "guidelim";

            try {
                pathsHandler[pathname[0]](req, res, user);
            } catch (err) {
                handle(req, res, parsedUrl)
            }
        } else {
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({error: 'Requisição negada.'}));
        }
    });

    httpserver.listen(process.env.PORT || 14000, async (err) => {
        if (err) throw err
        
        try {
            oracle.outFormat = oracle.OUT_FORMAT_OBJECT;
            oracle.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_7' })

            console.log("> TCC")

            con = await oracle.getConnection({
                user: process.env.USER,
                password: process.env.PASSWD,
                connectString: process.env.STRING_CONNECTION
            });
            console.log("> Connected in Oracle Client");

            console.log('> Ready on http://localhost:14000');
        } catch (error) {
        }
    });
})