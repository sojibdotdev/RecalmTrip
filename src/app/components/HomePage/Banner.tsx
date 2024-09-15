import EmblaCarousel from '../ReuseableComponents/EmblaCarousel'

function Banner() {
  const bannerItems = [
    {
      id: 1,
      image:
        'https://scontent.fdac20-1.fna.fbcdn.net/v/t39.30808-6/458764282_435837009499765_8077136147724346868_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=9ftbeEU5LZsQ7kNvgGPWaHg&_nc_ht=scontent.fdac20-1.fna&oh=00_AYAEug9tdIZg1JAgfxXgmhc9Im9Yjougixik7DMWT0xzIw&oe=66EA0F86'
    },
    {
      id: 2,
      image:
        'https://scontent.fdac20-1.fna.fbcdn.net/v/t39.30808-6/450089045_395792473504219_6152863676508925365_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=BzbGai45lwYQ7kNvgFUQ4qP&_nc_ht=scontent.fdac20-1.fna&_nc_gid=AuuRmxBqi0NzGydanOD2hb5&oh=00_AYCxaYqlzTmKQLf87jKZ8YaO4tl_RI7QGpqwmLztlWNsgQ&oe=66E9ED08'
    },
    {
      id: 3,
      image:
        'https://scontent.fdac20-1.fna.fbcdn.net/v/t39.30808-6/407424918_257961673953967_1245350113519659552_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=t-a6q5dBAC4Q7kNvgEAYmm1&_nc_ht=scontent.fdac20-1.fna&_nc_gid=AqOufIRuknvYk7bqMaVpEwa&oh=00_AYAWdc6qkaLGA6-WETjluHVuqcpOfYHYl7GDCNyS_L1eIQ&oe=66E9F8A5'
    }
  ]

  return (
    <div>
      <EmblaCarousel dot>
        {bannerItems.map((item) => (
          <div
            key={item.id}
            className="flex-[0_0_100%] aspect-[20/3] rounded-lg bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          ></div>
        ))}
      </EmblaCarousel>
    </div>
  )
}

export default Banner
