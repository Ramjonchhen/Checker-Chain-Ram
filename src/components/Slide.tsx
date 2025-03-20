import React, { useLayoutEffect } from 'react'

interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    slideType?: 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'slideIn' | 'slideAndFadeIn'
}
function Slide(props: SlideProps) {
    const itemRef = React.useRef<HTMLDivElement>(null)
  const { children, slideType = 'slideIn', ...rest } = props
    
  const getElementPosition = () => {
    const element = itemRef.current as HTMLDivElement

    const { top, left, width, height } = element.getBoundingClientRect()
    return { top, left, width, height }
    }

    const onScroll = () => {
        const element = itemRef.current as HTMLDivElement
        if(!element) return
        const { top, left, width, height} = getElementPosition()
        const { innerHeight, innerWidth } = window
        const isTopVisible = top < innerHeight
        const isLeftVisible = left < innerWidth
        const isBottomVisible = top + height > 0
        const isRightVisible = left + width > 0
        const isVisible = isTopVisible && isLeftVisible && isBottomVisible && isRightVisible
  
        if (isVisible ) {
            element.classList.add('animate-' + slideType)
        } else {
            element.classList.remove('animate-' + slideType) 
        }
    }

  useLayoutEffect(() => {
      window.addEventListener('scroll', onScroll)
      return   ()=>{
        window.removeEventListener('scroll', onScroll)
      }
    }, [itemRef])
  return (
    <div ref={itemRef} {...rest}>
        {children}
    </div>
  );      
}

export {Slide}