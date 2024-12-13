//Criação da class de criação de rotas
export class NewRoutings {
    //Declaração das variáveis
    routes: Array<object>;
    routesWithDockIncluse: Array<object>;
    populationSize: number;
    generations: number;
    mutationRate: number;
    populationGenerated: Array<object>;
    quantityRoutes: number;
    bestRoute: Array<number>;
    distanceRoute: number;
    curve: object;

    //Constructor == parameters
    constructor(_routes: Array<object>, _doca: Array<object>) {
        //Setando valores as variáveis
        this.routes = _routes;
        this.routesWithDockIncluse = [_doca,..._routes];
        this.populationSize = this.setPopulation();
        this.generations = 50;
        this.mutationRate = 0.2;
        this.curve = {store: 'CURVA', x: 24, y: 12};

        //Setup para lapidar as rotas e salvar em routesPolished
        this.quantityRoutes = this.routes.length;
        //função para criar as populações;
        this.populationGenerated = this.inicializePopulation();
        
        this.bestRoute = this.geneticAlgorithm();
    }

    setPopulation() {
        let pop = this.routes.length ** this.routes.length;

        if(pop > 1500) {
            pop = 1500
        }

        return pop
    }

    geneticAlgorithm(){
        let bestDistance : number = Number.MAX_SAFE_INTEGER;
        let bestRouterization : Array<number>;


        for (let gen = 0; gen < this.generations; gen++) {
            let newPopulation =  this.populationGenerated.map(route => this.mutate([...route as any]));
            
            newPopulation.forEach(scripts => {
                let distance = this.calculateDistance(scripts);
                console.log('Rota: ' + scripts + ' Distância: ' + distance + 'm');

                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestRouterization = [...scripts as any];
                }
            });
        }

        this.distanceRoute = bestDistance;
        
        console.log('Melhor Rota: ' + bestRouterization + ' Distância: ' + bestDistance + 'm');

        return bestRouterization;
    }

    calculateDistance(route: Array<number>){
        let totalDistance: number = 0;
        let curve: any = this.curve;

        for (let i = 0; i < route.length - 1; i++) {
            const localeA: any = this.routesWithDockIncluse[route[i]];
            const localeB: any = this.routesWithDockIncluse[route[i + 1]];
            
            if(localeA.eixo !== localeB.eixo) {
                totalDistance += Math.sqrt(((curve.x - localeA.x)**2) + ((curve.y - localeA.y)**2));
                totalDistance += Math.sqrt((localeB.x - curve.x)**2 + (localeB.y - curve.y)**2);
            } else {
                totalDistance += Math.sqrt((localeB.x - localeA.x)**2 + (localeB.y - localeA.y)**2);
            }
        }
    
        return parseFloat(totalDistance.toFixed(2));
    }

    mutate(route: Array<number>) {
        for (let i = 0; i < route.length; i++) {
            if (Math.random() < this.mutationRate) {
                let indexA = Math.floor(Math.random() * route.length);
                let indexB = Math.floor(Math.random() * route.length);
                
                let temp = route[indexA];
                route[indexA] = route[indexB];
                route[indexB] = temp;
            }
        }

        for (let i = 0; i < route.length; i++) {
            route[i] = route[i] + 1;
        }
        
        route.unshift(0);
        return route;
    }

    inicializePopulation(){
        let population = [];

        for (let i = 0; i < this.populationSize; i++) {
            population.push(this.createRoute());
        }

        console.log('População gerada:');
        console.log(population);

        return population;
    }

    createRoute() {
        let routesPopulation: Array<number> = Array.from(Array(this.quantityRoutes).keys());
        
        for (let i = routesPopulation.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [routesPopulation[i], routesPopulation[j]] = [routesPopulation[j], routesPopulation[i]];
        }
    
        return routesPopulation;
    }
}