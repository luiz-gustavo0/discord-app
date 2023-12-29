'use client'

import '@livekit/components-styles'

import { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

type MediaRoomProps = {
  chatId: string
  video: boolean
  audio: boolean
}

export const MediaRoom = ({ audio, chatId, video }: MediaRoomProps) => {
  const { user } = useUser()
  const [token, setToken] = useState('')

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) {
      return
    }

    const name = `${user.firstName} ${user.lastName}`

    ;(async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        )
        const data = await response.json()

        setToken(data.token)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [chatId, user?.firstName, user?.lastName])

  if (token === '') {
    return (
      <div className="flex justify-center items-center flex-col flex-1">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />

        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
