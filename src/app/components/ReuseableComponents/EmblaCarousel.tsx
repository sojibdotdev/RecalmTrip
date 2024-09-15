'use client'

import { EmblaCarouselType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback } from 'react'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'

Autoplay.globalOptions = { delay: 7000 }

type PropType = {
  children?: React.ReactNode
  dot?: boolean // Optional prop for showing dots
  arrow?: boolean // Optional prop for showing arrows
}

const EmblaCarousel: React.FC<PropType> = ({ children, dot, arrow }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({}, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi, onNavButtonClick)

  return (
    <section className="w-full m-auto relative group">
      <div className="overflow-hidden py-5" ref={emblaRef}>
        <div
          className="flex gap-4 touch-pan-y touch-pinch-zoom mx-2 "
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            MozBackfaceVisibility: 'hidden'
          }}
        >
          {children}
        </div>
      </div>

      {/* Embla Carousel Arrow Buttons (conditionally rendered) */}
      {arrow && (
        <>
          <div className="flex items-center justify-center absolute top-0 bottom-0 -left-4">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
          </div>
          <div className="flex items-center justify-center absolute top-0 bottom-0 -right-4">
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
        </>
      )}

      {/* Embla Carousel Dot Buttons (conditionally rendered) */}
      {dot && (
        <div className="flex flex-wrap justify-center items-center gap-3 absolute bottom-8 left-0 right-0 mx-auto">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`inline-flex appearance-none touch-manipulation cursor-pointer w-2 h-2 items-center justify-center rounded-full ${
                index === selectedIndex ? 'bg-primary-600' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default EmblaCarousel
