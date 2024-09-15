import localFont from 'next/font/local'

const centraFont = localFont({
  src: [
    {
      path: '../../public/font/centra-font/CentraNo2-Book.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/font/centra-font/CentraNo2-Medium.ttf',
      weight: '500',
      style: 'medium'
    },
    {
      path: '../../public/font/centra-font/CentraNo2-Bold.ttf',
      weight: '700',
      style: 'bold'
    }
  ],
  variable: '--font-centra'
})

export { centraFont }
