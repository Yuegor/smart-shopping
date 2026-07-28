// Quick-add presets for popular Russian retail chains and shop categories.
// Picking one fills the name field and assigns a matching icon; the name
// stays editable, so a preset is just a shortcut, not a locked-in value.
export const SHOP_PRESETS = [
  { name: 'Магнит', icon: 'store' },
  { name: 'Пятёрочка', icon: 'store' },
  { name: 'Монетка', icon: 'store' },
  { name: 'Мария-Ра', icon: 'store' },
  { name: 'Лента', icon: 'basket' },
  { name: 'Пекарня', icon: 'bread' },
  { name: 'Мясной уголок', icon: 'meat' },
  { name: 'Аптека', icon: 'pill' },
  { name: 'Рынок', icon: 'basket' },
  { name: 'Wildberries', icon: 'package' },
  { name: 'Ozon', icon: 'package' }
]

export const DEFAULT_SHOP_ICON = 'store'

// Icon choices offered when a person creates their own custom preset.
export const ICON_CHOICES = ['store', 'basket', 'bread', 'meat', 'pill', 'package', 'list']
