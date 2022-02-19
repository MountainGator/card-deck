import './card.css';


const Card = ({image, id, angle}) => {

    return (
        <div id={id} className='card'>
            <img src={image} alt="card image" className='card-image' style={{ transform: `rotate(${angle}deg)` }} />
        </div>
    )
}

export default Card;