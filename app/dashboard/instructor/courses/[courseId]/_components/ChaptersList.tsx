'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChapterI } from '@/types/course';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import classnames from 'classnames';
import { LuGrip, LuPencil } from 'react-icons/lu';

interface ChaptersListProps {
  items: ChapterI[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
  isPending: boolean;
}

const ChaptersList = ({ items, onReorder, onEdit, isPending }: ChaptersListProps) => {
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const reorderedChapters = Array.from(chapters);
      const [movedChapter] = reorderedChapters.splice(result.source.index, 1);
      reorderedChapters.splice(result.destination.index, 0, movedChapter);

      setChapters(reorderedChapters);

      const updateData = reorderedChapters.map((chapter, index) => ({
        id: chapter._id,
        position: index,
      }));

      onReorder(updateData);
    },
    [chapters, onReorder]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[100px]">
            {chapters.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-neutral-400 italic">
                No chapters yet.
              </p>
            ) : (
              chapters.map((chapter, index) => (
                <Draggable key={chapter._id} draggableId={chapter._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={classnames(
                        'flex items-center gap-x-2 bg-slate-200 border-neutral-200 border text-slate-600 rounded-md text-sm mb-4',
                        {
                          'bg-sky-100 text-cyan-700 border-cyan-200': chapter.isPublished,
                          'opacity-50': isPending,
                        }
                      )}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className={classnames(
                          'py-3 px-2 border-r border-r-neutral-200 hover:bg-neutral-300 rounded-l-md transition',
                          {
                            'border-r-cyan-200 hover:bg-cyan-200': chapter.isPublished,
                          }
                        )}
                        aria-label="Drag to reorder chapter"
                      >
                        <LuGrip className="w-4 h-4" />
                      </div>
                      <span className="flex-1">{chapter.title}</span>
                      <div className="ml-auto gap-x-2 pr-2 flex items-center">
                        {chapter.isFree && (
                          <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-500 text-white">
                            Free
                          </span>
                        )}
                        <span
                          className={classnames(
                            'inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-700 text-white dark:bg-white dark:text-neutral-800',
                            {
                              'bg-gray-400': chapter.isPublished,
                            }
                          )}
                        >
                          {chapter.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <button
                          onClick={() => onEdit(chapter._id)}
                          className="p-1 text-gray-600 hover:text-gray-800 hover:cursor-pointer dark:text-neutral-400 dark:hover:text-neutral-200"
                          aria-label={`Edit chapter ${chapter.title}`}
                          disabled={isPending}
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;