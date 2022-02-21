import Card from "./card";
import { useState, useEffect, useRef } from 'react';
import './card-deck.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CardDeck = () => {
    const deckIDRef = useRef();

    const [deck, setDeck] = useState([]);
    
    const [angle, setAngle] = useState(0);

    const [allow, setAllow] = useState(true);

    useEffect( () => {
        async function getDeck() {
            const response = await axios.get('http://deckofcardsapi.com/api/deck/new/');
            const { deck_id } = response.data;
            
            deckIDRef.current = deck_id;
        }

        getDeck();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        async function drawCard () {
            const response = await axios.get(`http://deckofcardsapi.com/api/deck/${deckIDRef.current}/draw/?count=1`);
            
            const { cards, remaining } = response.data;
            
            const { image, value, suit } = cards[0];

            return { image, value, suit, remaining };
        }
        setAngle(angle => angle += 10);
        addCard(await drawCard(), angle);
    }

    const handleShuffle = async (e) => {
        e.preventDefault();
        setDeck([]);
        setAngle(0);
        const response = await axios.get(`http://deckofcardsapi.com/api/deck/${deckIDRef.current}/shuffle/`);  
        setAllow(!allow);
    }


    const addCard = ({image, value, suit, remaining}, angle) => {
        setDeck([...deck, { image, value, suit, angle }])
        setAllow(allow => remaining === 0 ? false : true);
    };

    return (
        <div id="container">
            {allow && <button class="draw-card" onClick={handleSubmit}>Draw Card</button>}
            {!allow && <button class="draw-card" onClick={handleShuffle}>Shuffle Deck</button>}
            {deck.map(({ image, value, suit, angle }) => <Card 
            key={uuidv4()}
            id={uuidv4()}
            image={image} 
            value={value} 
            suit={suit} 
            angle={angle}
            />)}
        </div>
    )
}

export default CardDeck;