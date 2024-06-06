export default function Upgrades(props) {



    return (
      <>
        {console.log(props.game)}
        <div className="card p-2 mb-2">
          Bug Buying Bot -
          Buys 1 bug/second.
        </div> 
        <div className="card p-2 mb-2">
           High Quality Bugs - 
           Bugs sell for 25% more.
        </div>
        <div className="card p-2 mb-2">
          Slightly Larger Bag - 
          100 total food slots.
        </div>
      </>
    );
  }