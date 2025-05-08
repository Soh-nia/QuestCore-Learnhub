"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import toast from "react-hot-toast"
import { LuTrash2 } from "react-icons/lu"
import { type State, updateChapter, deleteChapter, invalidateChapterCache } from "@/app/lib/action"
import type { ChapterI } from "@/types/course"
import { memo } from "react"

interface ChapterActionProps {
  initialData: ChapterI
  courseId: string
  chapterId: string
  disabled: boolean
}

const ChapterAction = memo(function ChapterAction({ initialData, courseId, chapterId, disabled }: ChapterActionProps) {
  const initialState: State = { message: null, errors: {} }
  const [updateState, updateFormAction] = useActionState(updateChapter, initialState)
  const [deleteState, deleteFormAction] = useActionState(deleteChapter, initialState)
  const [isPending, startTransition] = useTransition()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()

  // Handle toast notifications for update and delete
  useEffect(() => {
    if (updateState.message?.includes("successfully")) {
      toast.success("Chapter updated successfully!")
      invalidateChapterCache(courseId, chapterId)
      router.refresh()
    } else if (updateState.message && !updateState.message.includes("successfully")) {
      toast.error(updateState.message)
    }

    if (deleteState.message?.includes("successfully")) {
      toast.success("Chapter deleted successfully!")
      invalidateChapterCache(courseId, chapterId)
      setTimeout(() => {
        router.push(`/dashboard/instructor/courses/${courseId}?success=true`)
      }, 100)
    } else if (deleteState.message && !deleteState.message.includes("successfully")) {
      toast.error(deleteState.message)
    }
  }, [updateState.message, deleteState.message, router, courseId, chapterId])

  const handlePublishToggle = useCallback(() => {
    const formData = new FormData()
    formData.append("courseId", courseId)
    formData.append("chapterId", chapterId)
    formData.append("isPublished", (!initialData.isPublished).toString())
    startTransition(() => {
      updateFormAction(formData)
    })
  }, [courseId, chapterId, initialData.isPublished, updateFormAction])

  const handleDelete = useCallback(() => {
    setShowDeleteModal(true)
  }, [])

  const confirmDelete = useCallback(() => {
    setShowDeleteModal(false)
    const formData = new FormData()
    formData.append("courseId", courseId)
    formData.append("chapterId", chapterId)
    startTransition(() => {
      deleteFormAction(formData)
    })
  }, [courseId, chapterId, deleteFormAction])

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-2">
        <button
          onClick={handlePublishToggle}
          disabled={isPending || (initialData.isPublished ? false : disabled)}
          className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-cyan-500 text-white shadow-sm hover:bg-cyan-600 focus:outline-none focus:bg-cyan-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:bg-cyan-700"
          title={disabled && !initialData.isPublished ? "Complete all required fields to publish" : ""}
        >
          {isPending ? "Processing..." : initialData.isPublished ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 inline-flex items-center text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white shadow-sm hover:bg-red-600 focus:outline-none focus:bg-red-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-red-700 dark:hover:bg-red-800 dark:focus:bg-red-800"
          title="Delete chapter"
          aria-haspopup="dialog"
          aria-expanded={showDeleteModal}
        >
          <LuTrash2 className="h-5 w-5" />
          <span className="sr-only">Delete chapter</span>
        </button>
      </div>

      {showDeleteModal && (
        <div
          className={`fixed inset-0 z-80 backdrop-blur-xs flex items-center justify-center transition-opacity duration-200 ${
            showDeleteModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-chapter-modal"
        >
          <div
            className={`bg-white dark:bg-neutral-800 rounded-xl p-4 max-w-lg w-full border border-gray-200 dark:border-neutral-700 shadow-2xs transform transition-transform duration-200 ${
              showDeleteModal ? "scale-100" : "scale-95"
            }`}
          >
            <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
              <h3 id="delete-chapter-modal" className="font-bold text-gray-800 dark:text-white">
                Delete Chapter
              </h3>
              <button
                type="button"
                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400"
                onClick={() => setShowDeleteModal(false)}
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="mt-1 text-gray-800 dark:text-neutral-400">
                Are you sure you want to delete this chapter? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-3 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                onClick={confirmDelete}
                disabled={isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default ChapterAction
