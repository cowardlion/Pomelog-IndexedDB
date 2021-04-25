import { useState } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

import { SortableItem, Item } from './SortableItem';
import { Category } from '../../api/category';

type Props = {
  categories: Category[];
};

export function SortableTable({ categories }: Props) {
  const [activeItem, setActiveItem] = useState<Category | null>(null);
  const [items, setItems] = useState(categories);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const item = categories.find(({ id }) => active.id === id) as Category;

    setActiveItem(item);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(({ id }) => id === active.id);
        const newIndex = items.findIndex(({ id }) => id === over.id);
        console.log(active, over);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveItem(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.name} item={item} />
        ))}
      </SortableContext>
      <DragOverlay style={{ position: 'relative' }}>
        {activeItem ? (
          <div style={{}}>
            <Item item={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
