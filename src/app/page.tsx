import Banner from './components/HomePage/Banner'
import HeroSeaction from './components/HomePage/HeroSection'

const HomePage = async () => {
  return (
    <div>
      <HeroSeaction />
      <div className="mt-32">
        <Banner />
      </div>
    </div>
  )
}

export default HomePage
