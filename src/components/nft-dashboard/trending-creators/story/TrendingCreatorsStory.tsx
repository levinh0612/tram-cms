import React from 'react';
import * as S from './TrendingCreatorsStory.styles';
import { Typography } from 'antd';

interface CreatorStoryProps {
  img: string;
  onStoryOpen: () => void;
  viewed: boolean;
  name?: string;
}

export const TrendingCreatorsStory: React.FC<CreatorStoryProps> = ({ img, onStoryOpen, viewed, name }) => {
  return (
    <div>
      <S.CreatorButton onClick={onStoryOpen} $viewed={viewed}>
        <S.Avatar src={img} alt="profile avatar" />

      </S.CreatorButton>

      {
        name && (
          <Typography>{name}</Typography>
        )
      }
    </div>
  );
};
