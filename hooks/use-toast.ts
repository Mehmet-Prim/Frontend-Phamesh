"use client"

import type React from "react"

// Adapted from shadcn/ui toast hook
import { useState, useEffect, useCallback } from "react"

type ToastProps = {
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
}

type ToastActionElement = React.ReactElement<{
    altText: string
    onClick: () => void
}>

// Stelle sicher, dass die Toast-Typ-Definition auch die open-Eigenschaft enthält
export type Toast = {
    id: string
    title?: string
    description?: string
    action?: ToastActionElement
    variant?: "default" | "destructive"
    open?: boolean
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

// Aktualisiere die ToasterToast-Typ-Definition, um die fehlenden Eigenschaften hinzuzufügen
type ToasterToast = ToastProps & {
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

type ActionType = typeof actionTypes

type Action =
    | {
    type: ActionType["ADD_TOAST"]
    toast: ToasterToast
}
    | {
    type: ActionType["UPDATE_TOAST"]
    toast: Partial<ToasterToast>
}
    | {
    type: ActionType["DISMISS_TOAST"]
    toastId?: string
}
    | {
    type: ActionType["REMOVE_TOAST"]
    toastId?: string
}

interface State {
    toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
            }

        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action

            if (toastId) {
                toastTimeouts.forEach((_, id) => {
                    if (id === toastId) {
                        toastTimeouts.delete(id)
                    }
                })

                return {
                    ...state,
                    toasts: state.toasts.map((t) =>
                        t.id === toastId
                            ? {
                                ...t,
                                open: false,
                            }
                            : t,
                    ),
                }
            }

            return {
                ...state,
                toasts: state.toasts.map((t) => ({
                    ...t,
                    open: false,
                })),
            }
        }
        case actionTypes.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            }
    }
}

export function useToast() {
    const [state, setState] = useState<State>({ toasts: [] })

    const dispatch = useCallback((action: Action) => {
        setState((prevState) => reducer(prevState, action))
    }, [])

    const toast = useCallback(
        ({ ...props }: Omit<ToasterToast, "id">) => {
            const id = generateId()

            const update = (props: Partial<ToasterToast>) =>
                dispatch({
                    type: actionTypes.UPDATE_TOAST,
                    toast: { ...props, id },
                })

            const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

            dispatch({
                type: actionTypes.ADD_TOAST,
                toast: {
                    ...props,
                    id,
                    open: true,
                    onOpenChange: (open: boolean) => {
                        if (!open) dismiss()
                    },
                },
            })

            return {
                id,
                dismiss,
                update,
            }
        },
        [dispatch],
    )

    const dismiss = useCallback(
        (toastId?: string) => {
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
        },
        [dispatch],
    )

    useEffect(() => {
        const handleRemoveToast = (toastId: string) => {
            dispatch({
                type: actionTypes.REMOVE_TOAST,
                toastId,
            })
        }

        state.toasts.forEach((toast) => {
            if (toast.open === false && !toastTimeouts.has(toast.id)) {
                const timeout = setTimeout(() => {
                    handleRemoveToast(toast.id)
                }, TOAST_REMOVE_DELAY)

                toastTimeouts.set(toast.id, timeout)
            }
        })

        return () => {
            toastTimeouts.forEach((timeout) => {
                clearTimeout(timeout)
            })
            toastTimeouts.clear()
        }
    }, [state.toasts, dispatch])

    return {
        toast,
        dismiss,
        toasts: state.toasts,
    }
}

