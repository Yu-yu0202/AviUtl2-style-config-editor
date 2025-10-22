import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { TranslationKey } from '../i18n/translations';

export type SettingsCardProp = {
  label?: string;
  labelKey?: TranslationKey;
  internalGroup: string;
  internalID: string;
  type: 'text' | 'number' | 'color' | 'info';
  placeholder?: string;
  value?: string | number;
  isSelected?: boolean;
};

export type SettingsCardProps = {
  title: string;
  items: SettingsCardProp[];
  onItemChange: (group: string, id: string, value: string) => void;
  onItemSelect: (group: string, id: string, selected: boolean) => void;
  getLabel?: (key: TranslationKey) => string;
};

export function SettingsCard({
  title,
  items,
  onItemChange,
  onItemSelect,
  getLabel,
}: SettingsCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${item.internalGroup}-${item.internalID}`}
                  checked={item.isSelected || false}
                  onCheckedChange={checked =>
                    onItemSelect(item.internalGroup, item.internalID, !!checked)
                  }
                />
                <Label
                  htmlFor={`${item.internalGroup}-${item.internalID}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {getLabel && item.labelKey
                    ? getLabel(item.labelKey as TranslationKey)
                    : item.label}
                </Label>
              </div>
              {item.type === 'color' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={
                      typeof item.value === 'string'
                        ? item.value.startsWith('#')
                          ? item.value
                          : `#${item.value}`
                        : '#000000'
                    }
                    onChange={e => {
                      const val = e.target.value.startsWith('#')
                        ? e.target.value.slice(1)
                        : e.target.value;
                      onItemChange(item.internalGroup, item.internalID, val);
                    }}
                    className="w-9 h-9 border border-input rounded-md cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={
                      typeof item.value === 'string'
                        ? item.value.replace(/^#/, '')
                        : ''
                    }
                    placeholder="000000"
                    maxLength={6}
                    onChange={e => {
                      const val = e.target.value.replace(/^#/, '');
                      onItemChange(item.internalGroup, item.internalID, val);
                    }}
                    className="w-20"
                  />
                </div>
              ) : (
                <Input
                  type={item.type}
                  placeholder={item.placeholder}
                  value={item.value || ''}
                  onChange={e =>
                    onItemChange(
                      item.internalGroup,
                      item.internalID,
                      e.target.value
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
