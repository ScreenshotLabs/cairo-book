import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides = [
  {
    href: '/authentication',
    name: 'Common Programming Concepts',
    description: 'This chapter covers concepts that appear in almost every programming language and how they work in Cairo.',
  },
  {
    href: '/pagination',
    name: 'Understanding Ownership',
    description: 'Cairo is a language built around a linear type system that allows us to statically ensure that in every Cairo program, a value is used exactly once.',
  },
  {
    href: '/errors',
    name: 'Enums and Pattern Matching',
    description:
      'Enums, short for "enumerations," are a way to define a custom data type that consists of a fixed set of named values, called variants.',
  },
  {
    href: '/webhooks',
    name: 'Starknet smart contracts',
    description:
      'Starknet contracts, in simple words, are programs that can run on the Starknet VM. ',
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
