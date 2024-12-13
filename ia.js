"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewRoutings = void 0;
//Criação da class de criação de rotas
var NewRoutings = /** @class */ (function () {
    //Constructor == parameters
    function NewRoutings(_routes, _doca) {
        //Setando valores as variáveis
        this.routes = _routes;
        this.routesWithDockIncluse = __spreadArray([_doca], _routes, true);
        this.populationSize = this.setPopulation();
        this.generations = 50;
        this.mutationRate = 0.2;
        this.curve = { store: 'CURVA', x: 24, y: 12 };
        //Setup para lapidar as rotas e salvar em routesPolished
        this.quantityRoutes = this.routes.length;
        //função para criar as populações;
        this.populationGenerated = this.inicializePopulation();
        this.bestRoute = this.geneticAlgorithm();
    }
    NewRoutings.prototype.setPopulation = function () {
        var pop = Math.pow(this.routes.length, this.routes.length);
        if (pop > 1500) {
            pop = 1500;
        }
        return pop;
    };
    NewRoutings.prototype.geneticAlgorithm = function () {
        var _this = this;
        var bestDistance = Number.MAX_SAFE_INTEGER;
        var bestRouterization;
        for (var gen = 0; gen < this.generations; gen++) {
            var newPopulation = this.populationGenerated.map(function (route) { return _this.mutate(__spreadArray([], route, true)); });
            newPopulation.forEach(function (scripts) {
                var distance = _this.calculateDistance(scripts);
                console.log('Rota: ' + scripts + ' Distância: ' + distance + 'm');
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestRouterization = __spreadArray([], scripts, true);
                }
            });
        }
        this.distanceRoute = bestDistance;
        console.log('Melhor Rota: ' + bestRouterization + ' Distância: ' + bestDistance + 'm');
        return bestRouterization;
    };
    NewRoutings.prototype.calculateDistance = function (route) {
        var totalDistance = 0;
        var curve = this.curve;
        for (var i = 0; i < route.length - 1; i++) {
            var localeA = this.routesWithDockIncluse[route[i]];
            var localeB = this.routesWithDockIncluse[route[i + 1]];
            if (localeA.eixo !== localeB.eixo) {
                totalDistance += Math.sqrt((Math.pow((curve.x - localeA.x), 2)) + (Math.pow((curve.y - localeA.y), 2)));
                totalDistance += Math.sqrt(Math.pow((localeB.x - curve.x), 2) + Math.pow((localeB.y - curve.y), 2));
            }
            else {
                totalDistance += Math.sqrt(Math.pow((localeB.x - localeA.x), 2) + Math.pow((localeB.y - localeA.y), 2));
            }
        }
        return parseFloat(totalDistance.toFixed(2));
    };
    NewRoutings.prototype.mutate = function (route) {
        for (var i = 0; i < route.length; i++) {
            if (Math.random() < this.mutationRate) {
                var indexA = Math.floor(Math.random() * route.length);
                var indexB = Math.floor(Math.random() * route.length);
                var temp = route[indexA];
                route[indexA] = route[indexB];
                route[indexB] = temp;
            }
        }
        for (var i = 0; i < route.length; i++) {
            route[i] = route[i] + 1;
        }
        route.unshift(0);
        return route;
    };
    NewRoutings.prototype.inicializePopulation = function () {
        var population = [];
        for (var i = 0; i < this.populationSize; i++) {
            population.push(this.createRoute());
        }
        console.log('População gerada:');
        console.log(population);
        return population;
    };
    NewRoutings.prototype.createRoute = function () {
        var _a;
        var routesPopulation = Array.from(Array(this.quantityRoutes).keys());
        for (var i = routesPopulation.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [routesPopulation[j], routesPopulation[i]], routesPopulation[i] = _a[0], routesPopulation[j] = _a[1];
        }
        return routesPopulation;
    };
    return NewRoutings;
}());
exports.NewRoutings = NewRoutings;
