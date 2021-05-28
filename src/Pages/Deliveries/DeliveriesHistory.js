import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Table, Button} from "react-bootstrap";
import restaurantService from "../../Services/restaurantService";

const DeliveriesHistory = () => {
    const [isClicked, setIsClicked] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState();
    const [currentRestaurantDeliveries, setCurrentRestaurantDeliveries] = useState([]);
    if (currentRestaurant != null) {
        restaurantService.getDeliveryList(currentRestaurant).then(response => {
            setCurrentRestaurantDeliveries(response.data)
        }).catch(e => {
            console.log(e);
        });
    }
    return (
        <div>
            <div style={{textAlign: "center"}}>
                <Image/>
            </div>
            <div>
                {isClicked ? [currentRestaurantDeliveries !== [] ? <GridContainer myVar={setIsClicked} current={currentRestaurantDeliveries}/> : <div>בטעינה</div> ] : <Restaurants_name_list myVar={setIsClicked} current={setCurrentRestaurant}/> }
            </div>
        </div>
    );
};
export default DeliveriesHistory;

const Restaurants_name_list = (props) => {
    const setClicked = props.myVar
    const setCurrentRestaurant = props.current

    return(
        <div className='restaurant_management' style={{alignItems: "center"}}>
            <div style={{textAlign: "center"}}>
            </div>
            <h1 style={{
                margin: 'auto',
                textAlign: 'right',
                color: '#052342',
                paddingRight: '10rem',
                fontSize: 40
            }}>:בחר מסעדה</h1>
            <div>
                <section className='restaurants' style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    {useSelector(state => state.allRestaurants).map((restaurant) => {
                        return <Restaurant key={restaurant.restaurantID} restaurant={restaurant} myVar={setClicked} current={setCurrentRestaurant}/>
                    })}
                </section>
            </div>
        </div>
    );
}

const Restaurant = (props) =>{
    const { name , restaurantID} = props.restaurant;
    return (
        <>
            <Button variant="primary" onClick={() => {props.myVar(true) ; props.current(restaurantID)}} style={{margin: 'auto', textAlign: 'Center', padding:'1rem'} }>{name}</Button>{' '}
        </>
    );
}

const GridContainer = (props) => {
    const setClicked = props.myVar
    const currentRestaurantDeliveries = props.current

    return(
        <div style={{textAlign: "center"}}>
            <div style={{padding: '10px'}}>
                <button onClick={() => setClicked(false)} style={{
                    margin: 'auto',
                    textAlign: 'center',
                    color: 'black',
                    fontSize: 20
                }}>חזור לרשימה</button>
            </div>
            <div style={{textAlign: "center"}}>
                    <div className="grid-container">
                    <div className="incidents_grid">
                        <h1 style={{textAlign:'center', textDecoration:'underline'}}>משלוחים</h1>
                        <div>
                            { currentRestaurantDeliveries.length === 0 ? (
                                    <div>אין משלוחים להציג</div>
                                ) :
                                <TableComponent myRestaurantDeliveries={currentRestaurantDeliveries} myVar={setClicked}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TableComponent = (props) => {
        const data = props.myRestaurantDeliveries;

        let headings = Object.keys(data[0]);
        return (
            <Table striped bordered hover variant="dark">
                <thead>
                <tr>
                    {
                        headings.map(heading => <th>{heading}</th>)
                    }
                </tr>
                </thead>
                <tbody>
                {
                    data.map(item =>
                        <tr>
                            {
                                headings.map(heading => <td>{item[heading]}</td>)
                            }
                        </tr>
                    )
                }
                </tbody>
            </Table>
        );
}

const Image = () => (
    <img className="logo"
         src={process.env.PUBLIC_URL + '/app_icon.png'}
         alt={""}
    />
)
