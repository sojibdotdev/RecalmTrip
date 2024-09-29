import { Banner, HeroSeaction } from './components/HomePage'

const HomePage = () => {
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
