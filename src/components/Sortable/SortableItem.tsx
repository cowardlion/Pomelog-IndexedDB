import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Category } from '../../api/category';

export const Item = forwardRef(({ item, ...props }: any, ref: any) => {
  return (
    <div {...props} ref={ref}>
      <span dangerouslySetInnerHTML={{ __html: `&#x${item.emoji};` }} />
      <strong> {item.name} </strong>
      <small> {item.keywords.join(',')}</small>
    </div>
  );
});

type Props = {
  item: Category;
};

export function SortableItem({ item }: Props) {
  const { id } = item;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    height: 50,
    backgroundColor: '#fff',
    border: '1px solid gray',
    borderRadius: '3px',
    margin: '3px 0',
    color: '#000',
    flexGrow: 1,
    alignItems: 'center',
    padding: '18px 20px',
    fontWeight: 400,
    fontSize: '1rem',
  };

  return <Item ref={setNodeRef} style={style} {...attributes} {...listeners} item={item} />;
}
