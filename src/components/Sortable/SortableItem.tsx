import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Category } from '../../api/category';
import styled from '@emotion/styled';
import { MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ItemStyled = styled.div`
  display: flex;
  justify-content: space-between;

  &:hover .right .delete {
    visibility: visible;
  }

  .dragging {
    background-color: 'red';
  }

  .emoji {
    display: inline-block;
    width: 25px;
    cursor: pointer;
  }

  .name {
    margin-right: 10px;
  }

  .right {
    width: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .delete {
      visibility: hidden;
    }

    .handle {
      cursor: grab;
    }
  }
`;

export const Item = forwardRef(({ item, listeners, ...props }: any, ref: any) => {
  return (
    <ItemStyled {...props} ref={ref}>
      <div>
        <span className="emoji" dangerouslySetInnerHTML={{ __html: `&#x${item.emoji};` }} />
        <strong className="name">{item.name}</strong>
        <small className="keyword">{item.keywords.join(', ')}</small>
      </div>

      <div className="right">
        <div className="delete">
          <Button style={{ border: 'none', transition: 'none' }}>삭제</Button>
        </div>
        <div className="handle" {...listeners}>
          <MenuOutlined />
        </div>
      </div>
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

  return <Item ref={setNodeRef} style={style} {...attributes} listeners={listeners} item={item} />;
}
