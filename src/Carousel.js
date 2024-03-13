import CarouselImages from "./CarouselImages.js";
import hairstyle1 from "./1.jpg";
import hairstyle2 from "./2.jpg";
import hairstyle3 from "./3.jpg";
function Carousel() {
    return (
        <div>
            <CarouselImages path={hairstyle1} />
            <CarouselImages path={hairstyle2} />
            <CarouselImages path={hairstyle3} />
        </div>
    );
}

export default Carousel;
