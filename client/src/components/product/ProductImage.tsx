import { productImageUrl } from '@/lib/productImageUrl'
import { useCallback, useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react'

const PLACEHOLDER = '/placeholder.svg'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | undefined | null
}

export function ProductImage({ src, onError, ...rest }: Props) {
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    setBroken(false)
  }, [src])

  const url = broken ? PLACEHOLDER : productImageUrl(src)

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      setBroken(true)
      onError?.(e)
    },
    [onError]
  )

  return <img src={url} onError={handleError} decoding="async" {...rest} />
}
