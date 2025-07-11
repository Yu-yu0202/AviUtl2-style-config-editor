import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export type SettingsCardProp = {
  label: string;
  internalGroup: string;
  internalID: string;
  type: 'text' | 'number' | 'color' | 'info';
  placeholder?: string;
  value?: string | number;
};

export type SettingsCardProps = {
  title: string;
  items: SettingsCardProp[];
  onItemChange: (group: string, id: string, value: string) => void;
};

export function SettingsCard({ title, items, onItemChange }: SettingsCardProps) {
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
              {item.type === 'color' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={
                      typeof item.value === 'string'
                        ? (item.value.startsWith('#') ? item.value : `#${item.value}`)
                        : '#000000'
                    }
                    onChange={e => {
                      const val = e.target.value.startsWith('#') ? e.target.value.slice(1) : e.target.value;
                      onItemChange(item.internalGroup, item.internalID, val);
                    }}
                    style={{ width: 36, height: 36, border: 'none', background: 'none', padding: 0 }}
                  />
                  <TextField
                    type="text"
                    value={typeof item.value === 'string' ? item.value.replace(/^#/, '') : ''}
                    size="small"
                    variant="outlined"
                    onChange={e => {
                      // 入力値から#を除去して保存
                      const val = e.target.value.replace(/^#/, '');
                      onItemChange(item.internalGroup, item.internalID, val);
                    }}
                    inputProps={{ maxLength: 6, style: { width: 80 } }}
                  />
                </Box>
              ) : (
                <TextField
                  type={item.type}
                  placeholder={item.placeholder}
                  value={item.value || ''}
                  size="small"
                  variant="outlined"
                  onChange={(e) => onItemChange(item.internalGroup, item.internalID, e.target.value)}
                />
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}