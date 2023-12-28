'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Plus, SmileIcon } from 'lucide-react'
import qs from 'query-string'
import axios from 'axios'

import { useModal } from '@/hooks/use-modal-store'

import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'

type ChatInputProps = {
  apiUrl: string
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
}

type FormData = z.infer<typeof formSchema>

const formSchema = z.object({
  content: z.string().min(1)
})

export const ChatInput = ({ apiUrl, name, query, type }: ChatInputProps) => {
  const { onOpen } = useModal()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: FormData) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      })

      await axios.post(url, data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                    type="button"
                    className="
                      absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 
                    dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300
                      rounded-full flex items-center justify-center transition p-1
                  "
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <SmileIcon />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
