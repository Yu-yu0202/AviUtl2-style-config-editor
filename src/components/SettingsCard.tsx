import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

type SettingsCardProp = {
  label: string;
  internalGroup: string;
  internalID: string;
  type: 'text' | 'number' | 'color' | 'info';
  placeholder?: string;
  value?: string | number;
};

type SettingsCardProps = {
  title: string;
  items: SettingsCardProp[];
};

export function SettingsCard({ title, items }: SettingsCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: '#e0e0e0',
        boxShadow: 'none',
        p: 2,
        width: 550
      }}
    >
      <CardHeader
        title={title}
        titleTypographyProps={{ color: 'primary', fontWeight: 'bold', fontSize: 20 }}
      />
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
          }}
        >
          {items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{item.label}</span>
              <TextField
                type={item.type === 'color' ? 'text' : item.type}
                placeholder={item.placeholder}
                value={item.type === 'number' ? Number(item.value) || '' : item.value}
                size="small"
                variant="outlined"
                InputProps={{
                  style: item.type === 'color'
                    ? { background: `#${item.value}`, color: '#fff' }
                    : undefined,
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}