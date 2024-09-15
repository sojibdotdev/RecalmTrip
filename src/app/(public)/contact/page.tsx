import EmblaCarousel from '../../components/ReuseableComponents/EmblaCarousel'

function ContactPage() {
  const items = [
    {
      id: 1,
      name: 'div 1'
    },
    {
      id: 2,
      name: 'div 2'
    },
    {
      id: 3,
      name: 'div 3'
    },
    {
      id: 4,
      name: 'div 4'
    },
    {
      id: 5,
      name: 'div 5'
    }
  ]
  return (
    <div className=" max-w-screen-xl mx-auto px-3 min-h-screen">
      <EmblaCarousel dot>
        {items.map((item) => (
          <div
            key={item.id}
            className=" bg-indigo-100 flex items-center justify-center flex-[0_0_100%] h-32 rounded-md"
          >
            <h1>{item.name}</h1>
          </div>
        ))}
      </EmblaCarousel>
    </div>
  )
}

export default ContactPage
