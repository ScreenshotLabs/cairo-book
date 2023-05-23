import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({ href, tag, active, isAnchorLink = false, children }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function VisibleSectionHighlight({ group, pathname }) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation()
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0]
    )
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({ group, pathname }) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-red-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, className }) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [router, sections] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation
  )

  let isActiveGroup =
    group.links.findIndex((link) => link.href === router.pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === router.pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === router.pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const navigation = [
  {
    title: 'The Cairo Programming Language',
    links: [
      { title: 'Foreword', href: '/ch00-01-foreword' },
      { title: 'Introduction', href: '/ch00-00-introduction' },
    ],
  },
  {
    title: 'Getting Started',
    links: [
      { title: 'Installation', href: '/ch01-01-installation' },
      { title: 'Hello, World!', href: '/ch01-02-hello-world' },
      { title: 'Hello, Scarb!', href: '/ch01-03-hello-scarb' },
    ],
  },
  {
    title: 'Common Programming Concepts',
    links: [
      {
        title: 'Common Programming Concepts',
        href: '/ch02-00-common-programming-concepts',
      },
      {
        title: 'Variables and Mutability',
        href: '/ch02-01-variables-and-mutability',
      },
      { title: 'Data Types', href: '/ch02-02-data-types' },
      { title: 'Functions', href: '/ch02-03-functions' },
      { title: 'Comments', href: '/ch02-04-comments' },
      { title: 'Control Flow', href: '/ch02-05-control-flow' },
      { title: 'Common Collections', href: '/ch02-06-common-collections' },
    ],
  },
  {
    title: 'Understanding Ownership',
    links: [
      {
        title: 'Understanding Ownership',
        href: '/ch03-00-understanding-ownership',
      },
      { title: 'What is Ownership?', href: '/ch03-01-what-is-ownership' },
      {
        title: 'References and Snapshots',
        href: '/ch03-02-references-and-snapshots',
      },
    ],
  },
  {
    title: 'Using Structs to Structure Related Data',
    links: [
      {
        title: 'Using Structs to Structure Related Data',
        href: '/ch04-00-using-structs-to-structure-related-data',
      },
      {
        title: 'Defining and Instantiating Structs',
        href: '/ch04-01-defining-and-instantiating-structs',
      },
      {
        title: 'An Example Program Using Structs',
        href: '/ch04-02-an-example-program-using-structs',
      },
      { title: 'Method Syntax', href: '/ch04-03-method-syntax' },
    ],
  },
  {
    title: 'Enums and Pattern Matching',
    links: [
      {
        title: 'Enums and Pattern Matching',
        href: '/ch05-00-enums-and-pattern-matching',
      },
      { title: 'Enums', href: '/ch05-01-enums' },
      {
        title: 'The Match Control Flow Construct',
        href: '/ch05-02-the-match-control-flow-construct',
      },
    ],
  },
  {
    title: 'Managing Cairo Projects with Packages, Crates and Modules',
    links: [
      {
        title: 'Managing Cairo Projects with Packages, Crates and Modules',
        href: '/ch06-00-managing-cairo-projects-with-packages-crates-and-modules',
      },
      { title: 'Packages and Crates', href: '/ch06-01-packages-and-crates' },
      {
        title: 'Defining Modules to Control Scope',
        href: '/ch06-02-defining-modules-to-control-scope',
      },
      {
        title: 'Paths for Referring to an Item in the Module Tree',
        href: '/ch06-03-paths-for-referring-to-an-item-in-the-module-tree',
      },
      {
        title: "Bringing Paths into Scope with the 'use' Keyword",
        href: '/ch06-04-bringing-paths-into-scope-with-the-use-keyword',
      },
      {
        title: 'Separating Modules into Different Files',
        href: '/ch06-05-separating-modules-into-different-files',
      },
    ],
  },
  {
    title: 'Generic Data Types',
    links: [
      { title: 'Generic Types', href: '/ch07-00-generic-types-and-traits' },
      { title: 'Generic Functions', href: '/ch07-01-generic-data-types' },
      { title: 'Traits in Cairo', href: '/ch07-02-traits-in-cairo' },
    ],
  },
  {
    title: 'Testing Cairo Programs',
    links: [
      {
        title: 'Testing Cairo Programs',
        href: '/ch08-00-testing-cairo-programs',
      },
      { title: 'How To Write Tests', href: '/ch08-01-how-to-write-tests' },
      { title: 'Testing Organization', href: '/ch08-02-test-organization' },
    ],
  },
  {
    title: 'Error Handling',
    links: [
      { title: 'Error Handling', href: '/ch09-00-error-handling' },
      {
        title: 'Unrecoverable Errors with panic',
        href: '/ch09-01-unrecoverable-errors-with-panic',
      },
      {
        title: 'Recoverable Errors with Result',
        href: '/ch09-02-error-handling',
      },
    ],
  },
  {
    title: 'Starknet smart contracts',
    links: [
      {
        title: 'Starknet Smart Contracts',
        href: './ch99-00-starknet-smart-contracts',
      },
      {
        title: 'Writing Starknet Contracts',
        href: './ch99-01-writing-starknet-contracts',
      },
      {
        title: 'ABIs and Cross-contract Interactions',
        href: './ch99-02-00-abis-and-cross-contract-interactions',
      },
      {
        title: 'ABIs and Interfaces',
        href: './ch99-02-01-abis-and-interfaces',
      },
      {
        title: 'Contract Dispatchers, Library Dispachers and system calls',
        href: './ch99-02-02-contract-dispatcher-library-dispatcher-and-system-calls',
      },
    ],
  },
  {
    title: 'Appendix',
    links: [
      { title: 'Appendix', href: '/appendix-00' },
      {
        title: 'A - Useful Development Tools',
        href: '/appendix-04-useful-development-tools',
      },
    ],
  },
]

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        {/* <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem> */}
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && 'md:mt-0'}
          />
        ))}
        {/* <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li> */}
      </ul>
    </nav>
  )
}
