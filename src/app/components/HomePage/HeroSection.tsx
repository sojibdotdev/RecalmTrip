import SliderImage from '../../../../public/images/hero-slider/hero-slider.jpg'
import { FilterIndex } from '../Filters'

function HeroSeaction() {
  return (
    <div
      className="  bg-cover bg-no-repeat bg-bottom h-[60vh] w-full rounded-lg  mx-auto relative"
      style={{ backgroundImage: `url(${SliderImage.src})` }}
    >
      <FilterIndex />
    </div>
  )
}

export { HeroSeaction }
