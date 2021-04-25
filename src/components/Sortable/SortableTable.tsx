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
    console.log(event);
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

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveItem(null);
  };

  const style = {
    display: 'flex',
    height: 50,
    backgroundColor: 'aliceblue',
    border: '1px dashed gray',
    borderRadius: '3px',
    margin: '3px 0',
    color: '#000',
    flexGrow: 1,
    alignItems: 'center',
    padding: '18px 20px',
    fontWeight: 400,
    fontSize: '1rem',
    transform: 'scaleX(1.02) scaleY(1.1) translate3d(0, 0, 0)',
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
      <DragOverlay>{activeItem ? <Item item={activeItem} style={style} /> : null}</DragOverlay>
    </DndContext>
  );
}
