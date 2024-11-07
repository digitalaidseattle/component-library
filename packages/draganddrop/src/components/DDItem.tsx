// import { Card, CardContent } from '@mui/material';
import * as React from 'react';
import  Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DDType } from './types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

type DDItemProps<T extends DDType> = {
  item: T;
};

const DDItem = <T extends DDType,>({ item }: DDItemProps<T>) => {
  return (
    <Card>
      <CardContent>id: {item.id}</CardContent>
    </Card>
  );
};

export default DDItem;
