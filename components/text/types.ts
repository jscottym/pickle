export type AlignType = 'left' | 'center' | 'right' | 'justify';

export type SizeType = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

export type WeightType = 
  | 'thin' 
  | 'extralight' 
  | 'light' 
  | 'normal' 
  | 'medium' 
  | 'semibold' 
  | 'bold' 
  | 'extrabold' 
  | 'black';

export type ColorType = 'primary' | 'success' | 'error' | 'neutral' | 'light' | 'dark';

export type VariantType = 
  | 'heading-mega'
  | 'heading-mega-bold'
  | 'heading-page' 
  | 'heading-section' 
  | 'heading-subsection'
  | 'body'
  | 'body-large'
  | 'body-small'
  | 'body-tiny'
  | 'code';

export interface BaseTextProps {
  as?: string;
  text?: string | null;
  variant?: VariantType;
  color?: ColorType;
  align?: AlignType;
  centered?: boolean;
  truncate?: boolean;
  muted?: boolean;
  bold?: boolean;
  margin?: boolean;
  hideIfEmpty?: boolean;
  class?: string;
}

export const createBaseTextProps = (defaults: Partial<BaseTextProps> = {}) => ({
  as: {
    type: String,
    default: defaults.as || 'span',
  },
  text: {
    type: String,
    default: defaults.text || '',
  },
  variant: {
    type: String as () => VariantType,
    default: defaults.variant || 'body',
  },
  color: {
    type: String as () => ColorType,
    default: defaults.color || 'neutral',
  },
  align: {
    type: String as () => AlignType,
    default: defaults.align || 'left',
  },
  centered: {
    type: Boolean,
    default: defaults.centered || false,
  },
  truncate: {
    type: Boolean,
    default: defaults.truncate || false,
  },
  muted: {
    type: Boolean,
    default: defaults.muted || false,
  },
  bold: {
    type: Boolean,
    default: defaults.bold || false,
  },
  margin: {
    type: Boolean,
    default: defaults.margin || false,
  },
  hideIfEmpty: {
    type: Boolean,
    default: defaults.hideIfEmpty || true,
  },
  class: {
    type: String,
    default: defaults.class || '',
  },
}); 