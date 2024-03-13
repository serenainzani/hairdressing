import "./App.css";
import Navbar from "./Navbar.js";
import Carousel from "./Carousel.js";
import MainButton from "./MainButton.js";

function App() {
    return (
        <div className="App">
            <nav>
                <Navbar />
            </nav>

            <body>
                <div>
                    <h1>Lounge Salon</h1>
                    <h2>Hair & Beauty</h2>
                </div>

                <Carousel />
                <MainButton text="Book Now ✂️" />
            </body>
        </div>
    );
}

export default App;
