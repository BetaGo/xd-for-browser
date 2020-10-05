type SemanticColor = {
  informative: string;
  negative: string;
  notice: string;
  positive: string;
};

export interface ITheme {
  palette: {
    primary: string;
    secondary: string;
    background: {
      default: string;
      hover: string;
    };
    text: {
      primary: string;
      hover: string;
      disabled: string;
      label: string;
      invalid: string;
      selected: string;
    };
    icon: SemanticColor;
  };
}

export const defaultTheme: ITheme = {
  palette: {
    primary: "var(--spectrum-global-color-blue-500)",
    secondary: "var(--spectrum-global-color-red-600)",
    background: {
      default: "var(--spectrum-alias-background-color-default)",
      hover: "var(--spectrum-alias-highlight-hover)",
    },
    text: {
      primary: "var(--spectrum-alias-text-color)",
      hover: "var(--spectrum-alias-text-color-hover)",
      label: "var(--spectrum-alias-label-text-color)",
      disabled: "var(--spectrum-alias-text-color-disabled)",
      invalid: "var(--spectrum-alias-text-color-invalid)",
      selected: "var(--spectrum-alias-text-color-selected)",
    },
    icon: {
      informative: "var(--spectrum-semantic-informative-color-icon)",
      negative: "var(--spectrum-semantic-negative-color-icon)",
      notice: "var(--spectrum-semantic-notice-color-icon)",
      positive: "var(--spectrum-semantic-positive-color-icon)",
    },
  },
};
