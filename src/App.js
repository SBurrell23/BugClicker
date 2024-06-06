/* eslint-disable no-unused-vars */
import './css/App.css';
import { useState, useEffect } from "react";
import Upgrades from "./upgrades/Upgrades";
import Navbar from './Header.js';

export default function Content() {
    
    let [game, setGame] = useState({
        bugs: 0,
        food: 10,
        foodMax: 50,
        money: 0.00,
        clicks: 0,
        time: 0
    }); 

    let [bugFoodCost, setBugFoodCost] = useState(1);
    let [bugSalePrice, setBugSalePrice] = useState(1.50);
    let [foodCost, setFoodCost] = useState(10);

   function getBug() {
        setGame({
            ...game, 
            bugs: game.bugs+1, 
            food: game.food-1,
            clicks: game.clicks+1
        });
    };

    function sellBug(){
        setGame({
            ...game, 
            bugs: game.bugs-1, 
            money: game.money+bugSalePrice
        });
    };

    function buyFood(){
        setGame({
            ...game, 
            food: game.food+10, 
            money: game.money-foodCost
        });
    };


    return (
      <>
        <Navbar />
        <div className="container unselectable" style={{"marginTop":"85px"}}>

            <div className="row">
                <div className="col-6">
                    <h1 style={{color:"#122c12"}}>Bugs: {game.bugs}</h1>
                    <button className="btn btn-primary mt-2" disabled={game.food<bugFoodCost} onClick={getBug}>Get Bug ({bugFoodCost} Food)</button>

                    <h4 className="mt-5">Money: ${game.money}</h4>
                    <h4 className="mb-2">Food: {game.food} / {game.foodMax}</h4>
        
                    <button className="btn btn-danger me-2" disabled={game.bugs<1} onClick={sellBug}>Sell Bug (${bugSalePrice.toFixed(2)})</button>
                    <button className="btn btn-success" disabled={game.money<foodCost || (game.food +10)>=game.foodMax} onClick={buyFood}>Buy Food ${foodCost} for 10</button>
                </div>
                <div className="col-6">
                    <h3>Upgrades</h3>
                    <hr></hr>
                    <Upgrades game={game} />
                </div>
            </div>

        </div>
      </>
    );
}