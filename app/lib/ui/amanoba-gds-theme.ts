'use client';

import { extendGdsTheme } from '@gds/theme';
import {
  AMANOBA_MANTINE_BASE,
  AMANOBA_MANTINE_PALETTES,
  BRAND_COLORS,
  EMAIL_THEME_DEFAULT,
} from '@/app/lib/constants/color-tokens';

/**
 * Amanoba brand extension of GDS base theme (THEME_GOVERNANCE).
 * Consumes `@gds/theme` via local SSOT alias; prefer `/client` when published on npm.
 */
export const amanobaMantineTheme = extendGdsTheme({
  primaryColor: 'amanoba',
  primaryShade: 5,
  defaultRadius: 'md',
  black: AMANOBA_MANTINE_BASE.black,
  white: AMANOBA_MANTINE_BASE.white,
  autoContrast: true,
  luminanceThreshold: 0.32,
  fontFamily: 'var(--font-noto-sans), var(--font-inter), system-ui, sans-serif',
  headings: {
    fontFamily: 'var(--font-noto-sans), var(--font-inter), system-ui, sans-serif',
    fontWeight: '700',
  },
  colors: {
    amanoba: [...AMANOBA_MANTINE_PALETTES.amanoba],
    amanobaYellow: [...AMANOBA_MANTINE_PALETTES.amanobaYellow],
    ink: [...AMANOBA_MANTINE_PALETTES.ink],
  },
  other: {
    brand: BRAND_COLORS,
    email: EMAIL_THEME_DEFAULT,
  },
  components: {
    Text: {
      defaultProps: {
        c: 'gray.2',
      },
    },
    Title: {
      defaultProps: {
        c: 'white',
      },
    },
    Anchor: {
      defaultProps: {
        c: 'amanoba.5',
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          borderColor: 'var(--mantine-color-ink-6)',
          color: 'var(--mantine-color-gray-1)',
        },
        label: {
          color: 'var(--mantine-color-gray-1)',
        },
        description: {
          color: 'var(--mantine-color-gray-4)',
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          borderColor: 'var(--mantine-color-ink-6)',
          color: 'var(--mantine-color-gray-1)',
        },
        label: {
          color: 'var(--mantine-color-gray-1)',
        },
        description: {
          color: 'var(--mantine-color-gray-4)',
        },
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          borderColor: 'var(--mantine-color-ink-6)',
          color: 'var(--mantine-color-gray-1)',
        },
        label: {
          color: 'var(--mantine-color-gray-1)',
        },
        description: {
          color: 'var(--mantine-color-gray-4)',
        },
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          borderColor: 'var(--mantine-color-ink-6)',
          color: 'var(--mantine-color-gray-1)',
        },
        dropdown: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          borderColor: 'var(--mantine-color-ink-6)',
        },
        option: {
          color: 'var(--mantine-color-gray-1)',
        },
        label: {
          color: 'var(--mantine-color-gray-1)',
        },
        description: {
          color: 'var(--mantine-color-gray-4)',
        },
      },
    },
    MultiSelect: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          borderColor: 'var(--mantine-color-ink-6)',
          color: 'var(--mantine-color-gray-1)',
        },
        pill: {
          backgroundColor: 'var(--mantine-color-ink-9)',
          color: 'var(--mantine-color-gray-1)',
        },
        dropdown: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          borderColor: 'var(--mantine-color-ink-6)',
        },
        option: {
          color: 'var(--mantine-color-gray-1)',
        },
        label: {
          color: 'var(--mantine-color-gray-1)',
        },
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
        radius: 'md',
      },
      styles: {
        content: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          color: 'var(--mantine-color-gray-2)',
        },
        header: {
          backgroundColor: 'var(--mantine-color-ink-8)',
        },
        title: {
          color: 'var(--mantine-color-white)',
          fontWeight: 700,
        },
      },
    },
    Drawer: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        content: {
          backgroundColor: 'var(--mantine-color-ink-8)',
          color: 'var(--mantine-color-gray-2)',
        },
        header: {
          backgroundColor: 'var(--mantine-color-ink-8)',
        },
        title: {
          color: 'var(--mantine-color-white)',
          fontWeight: 700,
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
        bg: 'ink.8',
        c: 'gray.2',
      },
      styles: {
        root: {
          borderColor: 'var(--mantine-color-ink-6)',
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        bg: 'ink.8',
        c: 'gray.2',
      },
      styles: {
        root: {
          borderColor: 'var(--mantine-color-ink-6)',
        },
      },
    },
    Code: {
      defaultProps: {
        bg: 'ink.9',
        c: 'gray.1',
      },
    },
    Tabs: {
      styles: {
        tab: {
          color: 'var(--mantine-color-gray-2)',
        },
        list: {
          borderColor: 'var(--mantine-color-ink-6)',
        },
      },
    },
    Badge: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
});
