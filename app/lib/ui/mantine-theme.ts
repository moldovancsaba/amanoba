import { createTheme, type MantineThemeOverride } from '@mantine/core';

export const amanobaMantineTheme: MantineThemeOverride = createTheme({
  primaryColor: 'amanoba',
  primaryShade: 5,
  defaultRadius: 'md',
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
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
        radius: 'md',
      },
    },
    Drawer: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
