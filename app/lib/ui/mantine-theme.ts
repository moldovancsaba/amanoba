import { createTheme, type MantineThemeOverride } from '@mantine/core';

export const amanobaMantineTheme: MantineThemeOverride = createTheme({
  primaryColor: 'amanoba',
  primaryShade: 5,
  defaultRadius: 'md',
  black: '#111111',
  white: '#f7f7f7',
  autoContrast: true,
  luminanceThreshold: 0.32,
  fontFamily: 'var(--font-noto-sans), var(--font-inter), system-ui, sans-serif',
  headings: {
    fontFamily: 'var(--font-noto-sans), var(--font-inter), system-ui, sans-serif',
    fontWeight: '700',
  },
  colors: {
    amanoba: [
      '#fff9e6',
      '#fff0bf',
      '#ffe38a',
      '#ffd452',
      '#ffc421',
      '#fab908',
      '#c89100',
      '#966c00',
      '#654800',
      '#332400',
    ],
    amanobaYellow: [
      '#fff9e6',
      '#fff0bf',
      '#ffe38a',
      '#ffd452',
      '#ffc421',
      '#fab908',
      '#c89100',
      '#966c00',
      '#654800',
      '#332400',
    ],
    ink: [
      '#f7f7f7',
      '#e6e6e6',
      '#c9c9c9',
      '#a8a8a8',
      '#878787',
      '#686868',
      '#4f4f4f',
      '#3a3a3a',
      '#2d2d2d',
      '#111111',
    ],
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
