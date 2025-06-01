'use client'
// import React from 'react'
// import { startTransition, useState } from 'react'
// import { startTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    // FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import type { Todo } from '@/utils/types'
import { cn } from '@/lib/utils'
import { addTodo } from './actions'

const formSchema = z.object({
    Title: z.string().min(1, {
        message: 'Title is required.',
    }),
    Category: z.string().min(1, {
        message: 'Category is required.',
    }),
    Description: z.string().optional(),
    DueDate: z.coerce
        .date({ invalid_type_error: 'DueDate must be a valid date.' })
        .optional(),
})

type AddTodoProps = {
    refresh: () => void
}

export default function AddTodo({ refresh }: AddTodoProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Title: '',
            Category: '',
            Description: '',
            DueDate: new Date(), // Default to current date
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        // Convert the form values to match the Todo type

        const fd = new FormData()
        Object.entries(values).forEach(([k, v]) => {
            // If DueDate is a Date, this becomes something like "2025-05-31T00:00:00.000Z"
            // If it’s undefined, FormData skips it.
            if (v !== undefined) {
                fd.append(k, String(v))
            }
        })

        const result = await addTodo(fd)

        if (result?.error) {
            // Push Zod errors back into react-hook-form
            Object.entries(result.error).forEach(([field, messages]) =>
                form.setError(field as keyof z.infer<typeof formSchema>, {
                    message: (messages as string[])[0],
                })
            )
        } else if (result?.success) {
            refresh()
            form.reset() // clear the form
            // redirect to dasbhoard
            // router.push('/dashboard')
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8 m-4 '
            >
                <div className='flex gap-4'>
                    <FormField
                        control={form.control}
                        name='Title'
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder='Title' {...field} />
                                </FormControl>
                                {/* <FormDescription>Title</FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='Category'
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder='Category' {...field} />
                                </FormControl>
                                {/* <FormDescription>Category</FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='Description'
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Description'
                                        {...field}
                                    />
                                </FormControl>
                                {/* <FormDescription>Description</FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='DueDate'
                        render={({ field }) => (
                            <FormItem className='flex flex-col flex-1'>
                                <FormLabel>Due Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild className='flex-1'>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className='w-auto p-0 flex-1'
                                        align='start'
                                    >
                                        <Calendar
                                            mode='single'
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {/* <FormDescription>
                                    Your date of birth is used to calculate your
                                    age.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type='submit' className='w-full cursor-pointer'>
                    Submit
                </Button>
            </form>
        </Form>
    )
}
