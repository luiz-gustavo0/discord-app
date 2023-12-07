import { UserButton } from '@clerk/nextjs'

import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <div className="flex flex-col">
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  )
}
