import type { Block, Field } from 'payload'
import { blockThemeField } from '@/lib/blockThemes'
import { buildIconChoiceFields } from '@/lib/fontAwesomeIcons'

const sectionSpacingField: Field = {
  name: 'compactSpacing',
  type: 'checkbox',
  defaultValue: false,
  label: {
    en: 'Compact section spacing',
    uk: 'Компактний відступ секції',
    es: 'Espaciado compacto de la seccion',
  },
  admin: {
    description: {
      en: 'Use smaller vertical padding when the block has only a title or a short intro.',
      uk: 'Менший вертикальний відступ для блоків з одним заголовком або коротким вступом.',
      es: 'Usa un espaciado vertical menor cuando el bloque tiene solo un titulo o una introduccion corta.',
    },
  },
}

function appearanceCollapsible(fields: Field[]): Field {
  return {
    type: 'collapsible',
    label: { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
    admin: { initCollapsed: false },
    fields,
  }
}

/** Advantages option: render each icon inside a soft circle (70px) with larger body text. */
export const advantagesIconStyleField: Field = {
  name: 'iconStyle',
  type: 'select',
  defaultValue: 'plain',
  options: [
    {
      label: {
        en: 'Plain icon',
        uk: 'Звичайна іконка',
        es: 'Icono simple',
      },
      value: 'plain',
    },
    {
      label: {
        en: 'Icon in a circle',
        uk: 'Іконка в крузі',
        es: 'Icono en un circulo',
      },
      value: 'circle',
    },
  ],
  label: {
    en: 'Icon Style',
    uk: 'Стиль іконки',
    es: 'Estilo del icono',
  },
  admin: {
    description: {
      en: '"Icon in a circle" shows a larger icon on a soft round background and slightly larger item text.',
      uk: '«Іконка в крузі» показує більшу іконку на світлому круглому фоні та трохи більший текст пунктів.',
      es: '«Icono en un circulo» muestra un icono mas grande sobre un fondo redondo suave y un texto algo mayor.',
    },
  },
}

export const timelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: {
      en: 'Timeline',
      uk: 'Таймлайн етапів',
      es: 'Linea de tiempo',
    },
    plural: {
      en: 'Timeline Blocks',
      uk: 'Блоки таймлайну',
      es: 'Bloques de linea de tiempo',
    },
  },
  fields: [
    appearanceCollapsible([blockThemeField, sectionSpacingField]),
    {
      name: 'sectionTitle',
      type: 'text',
      label: {
        en: 'Section Title',
        uk: 'Заголовок секції',
        es: 'Titulo de la seccion',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      admin: {
        description: {
          en: 'Stages are shown in one row connected by a line (up to 6). On mobile they stack vertically.',
          uk: 'Етапи показуються в один ряд, з’єднані лінією (до 6). На мобільному — вертикально.',
          es: 'Las etapas se muestran en una fila unidas por una linea (hasta 6). En movil se apilan verticalmente.',
        },
        components: {
          RowLabel: '/components/admin/TitleRowLabel#TitleRowLabel',
        },
      },
      labels: {
        singular: {
          en: 'Stage',
          uk: 'Етап',
          es: 'Etapa',
        },
        plural: {
          en: 'Stages',
          uk: 'Етапи',
          es: 'Etapas',
        },
      },
      fields: [
        ...buildIconChoiceFields(),
        {
          name: 'title',
          type: 'text',
          required: true,
          label: {
            en: 'Title',
            uk: 'Заголовок',
            es: 'Titulo',
          },
        },
        {
          name: 'text',
          type: 'richText',
          label: {
            en: 'Text',
            uk: 'Текст',
            es: 'Texto',
          },
        },
      ],
    },
  ],
}

export const iconHighlightBlock: Block = {
  slug: 'iconHighlight',
  labels: {
    singular: {
      en: 'Icon Highlight',
      uk: 'Акцентний блок з іконкою',
      es: 'Destacado con icono',
    },
    plural: {
      en: 'Icon Highlight Blocks',
      uk: 'Акцентні блоки з іконкою',
      es: 'Bloques destacados con icono',
    },
  },
  fields: [
    appearanceCollapsible([
      {
        ...blockThemeField,
        defaultValue: 'soft',
      },
      sectionSpacingField,
    ]),
    ...buildIconChoiceFields(),
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Title',
        uk: 'Заголовок',
        es: 'Titulo',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: {
        en: 'Text',
        uk: 'Текст',
        es: 'Texto',
      },
    },
  ],
}
