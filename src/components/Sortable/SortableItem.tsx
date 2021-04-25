import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Category } from '../../api/category';
import styled from '@emotion/styled';

const ItemStyled = styled.div`
  .dragging {
    background-color: 'red';
  }

  .emoji {
    width: 25px;
    cursor: pointer;
  }

  .name {
    margin-right: 10px;
  }
`;

export const Item = forwardRef(({ item, ...props }: any, ref: any) => {
  return (
    <ItemStyled {...props} ref={ref}>
      <span className="emoji" dangerouslySetInnerHTML={{ __html: `&#x${item.emoji};` }} />
      <strong className="name">{item.name}</strong>
      <small className="keyword">{item.keywords.join(', ')}</small>
    </ItemStyled>
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
