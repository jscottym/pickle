import { twMerge } from 'tailwind-merge'

export const useTwMerge = () => {
  return {
    cn: (...classes: (string | string[] | undefined)[]) => {
      const flatClasses = classes.flat().filter(Boolean) as string[]
      return twMerge(...flatClasses)
    }
  }
} 